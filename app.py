from flask import Flask, render_template
import yfinance as yf
import plotly.graph_objects as go
import plotly.io as pio
import pandas as pd
from datetime import date

app = Flask(__name__)

ACOES = {
    "Petrobras": "PETR4.SA",
    "Itaú": "ITUB4.SA",
    "Santander": "SANB11.SA",
}

CORES = {
    "Petrobras": "#60a5fa",
    "Itaú": "#fb923c",
    "Santander": "#f87171",
}

CORES_FILL = {
    "Petrobras": "rgba(96,165,250,0.08)",
    "Itaú": "rgba(251,146,60,0.08)",
    "Santander": "rgba(248,113,113,0.08)",
}

TICKERS_DISPLAY = {
    "Petrobras": "PETR4",
    "Itaú": "ITUB4",
    "Santander": "SANB11",
}

INICIO = "2025-01-01"
FIM = date.today().isoformat()

LAYOUT_BASE = dict(
    template="plotly_white",
    font=dict(family="Inter, Segoe UI, Arial", size=13, color="#374151"),
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    margin=dict(l=10, r=10, t=50, b=10),
    hovermode="x unified",
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    xaxis=dict(showgrid=True, gridcolor="#f1f5f9", linecolor="#e2e8f0"),
    yaxis=dict(showgrid=True, gridcolor="#f1f5f9", linecolor="#e2e8f0"),
)


def buscar_dados():
    dados = {}
    for nome, ticker in ACOES.items():
        df = yf.download(ticker, start=INICIO, end=FIM, auto_adjust=True, progress=False)
        df.index = pd.to_datetime(df.index)
        dados[nome] = df
    return dados


def calcular_stats(dados):
    stats = {}
    for nome, df in dados.items():
        if df.empty:
            continue
        close = df["Close"].squeeze()
        preco_atual = float(close.iloc[-1])
        preco_anterior = float(close.iloc[-2]) if len(close) > 1 else preco_atual
        preco_inicio = float(close.iloc[0])

        variacao_dia = preco_atual - preco_anterior
        variacao_dia_pct = (variacao_dia / preco_anterior) * 100
        retorno_ytd = (preco_atual / preco_inicio - 1) * 100
        maximo = float(close.max())
        minimo = float(close.min())

        stats[nome] = {
            "ticker": TICKERS_DISPLAY[nome],
            "preco": preco_atual,
            "variacao_dia": variacao_dia,
            "variacao_dia_pct": variacao_dia_pct,
            "retorno_ytd": retorno_ytd,
            "maximo": maximo,
            "minimo": minimo,
        }
    return stats


def grafico_preco(dados):
    fig = go.Figure()
    for nome, df in dados.items():
        if df.empty:
            continue
        close = df["Close"].squeeze()
        fig.add_trace(go.Scatter(
            x=df.index,
            y=close,
            name=nome,
            line=dict(color=CORES[nome], width=2.5),
            fill="tozeroy",
            fillcolor=CORES_FILL[nome],
            hovertemplate="%{x|%d/%m/%Y}<br><b>R$ %{y:.2f}</b><extra>" + nome + "</extra>",
        ))
    layout = {**LAYOUT_BASE, "yaxis": {**LAYOUT_BASE["yaxis"], "tickprefix": "R$ "}}
    fig.update_layout(**layout)
    return pio.to_json(fig)


def grafico_retorno(dados):
    fig = go.Figure()
    for nome, df in dados.items():
        if df.empty:
            continue
        close = df["Close"].squeeze()
        retorno = (close / close.iloc[0] - 1) * 100
        fig.add_trace(go.Scatter(
            x=df.index,
            y=retorno,
            name=nome,
            line=dict(color=CORES[nome], width=2.5),
            hovertemplate="%{x|%d/%m/%Y}<br><b>%{y:.2f}%</b><extra>" + nome + "</extra>",
        ))
    fig.add_hline(y=0, line_dash="dot", line_color="#94a3b8", opacity=0.7)
    layout = {**LAYOUT_BASE, "yaxis": {**LAYOUT_BASE["yaxis"], "ticksuffix": "%"}}
    fig.update_layout(**layout)
    return pio.to_json(fig)


def grafico_volume(dados):
    fig = go.Figure()
    for nome, df in dados.items():
        if df.empty:
            continue
        volume = df["Volume"].squeeze()
        fig.add_trace(go.Bar(
            x=df.index,
            y=volume,
            name=nome,
            marker_color=CORES[nome],
            opacity=0.8,
            hovertemplate="%{x|%d/%m/%Y}<br><b>%{y:,.0f}</b><extra>" + nome + "</extra>",
        ))
    layout = {**LAYOUT_BASE, "barmode": "group"}
    fig.update_layout(**layout)
    return pio.to_json(fig)


def grafico_candlestick(dados):
    fig = go.Figure()
    nomes = list(dados.keys())
    for i, (nome, df) in enumerate(dados.items()):
        if df.empty:
            continue
        fig.add_trace(go.Candlestick(
            x=df.index,
            open=df["Open"].squeeze(),
            high=df["High"].squeeze(),
            low=df["Low"].squeeze(),
            close=df["Close"].squeeze(),
            name=nome,
            visible=(i == 0),
            increasing_line_color="#22c55e",
            decreasing_line_color="#ef4444",
            increasing_fillcolor="#22c55e",
            decreasing_fillcolor="#ef4444",
        ))

    botoes = []
    for i, nome in enumerate(nomes):
        visibilidade = [j == i for j in range(len(nomes))]
        botoes.append(dict(
            label=nome,
            method="update",
            args=[{"visible": visibilidade}, {"title": f"Candlestick — {nome}"}],
        ))

    layout = {
        **LAYOUT_BASE,
        "title": f"Candlestick — {nomes[0]}",
        "xaxis": {**LAYOUT_BASE["xaxis"], "rangeslider": {"visible": False}},
        "yaxis": {**LAYOUT_BASE["yaxis"], "tickprefix": "R$ "},
        "updatemenus": [dict(
            active=0,
            buttons=botoes,
            direction="down",
            x=0.0,
            xanchor="left",
            y=1.18,
            yanchor="top",
            bgcolor="#f8fafc",
            bordercolor="#e2e8f0",
            font=dict(size=13),
        )],
    }
    fig.update_layout(**layout)
    return pio.to_json(fig)


@app.route("/")
def index():
    dados = buscar_dados()
    stats = calcular_stats(dados)
    atualizado = date.today().strftime("%d/%m/%Y")
    return render_template(
        "index.html",
        graph_preco=grafico_preco(dados),
        graph_retorno=grafico_retorno(dados),
        graph_volume=grafico_volume(dados),
        graph_candlestick=grafico_candlestick(dados),
        stats=stats,
        atualizado=atualizado,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
