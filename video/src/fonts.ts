import { loadFont as loadPlayfairRaw } from '@remotion/google-fonts/PlayfairDisplay';
import { loadFont as loadJetBrainsRaw } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadDMSansRaw }    from '@remotion/google-fonts/DMSans';

export const { fontFamily: playfairFamily } = loadPlayfairRaw('normal', {
  weights: ['700', '900'],
  subsets: ['latin'],
});

export const { fontFamily: jetbrainsFamily } = loadJetBrainsRaw('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const { fontFamily: dmsansFamily } = loadDMSansRaw('normal', {
  weights: ['300', '400', '500'],
  subsets: ['latin'],
});
