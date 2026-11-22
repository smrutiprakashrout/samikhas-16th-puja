import { loadFont as loadCormorant, fontFamily as cormorantFamily } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadDmSans, fontFamily as dmSansFamily } from '@remotion/google-fonts/DMSans';
import { loadFont as loadNotoOriya, fontFamily as notoOriyaFamily } from '@remotion/google-fonts/NotoSerifOriya';

loadCormorant('normal', { weights: ['400', '500', '600'], subsets: ['latin'] });
loadCormorant('italic', { weights: ['400', '500'], subsets: ['latin'] });
loadDmSans('normal', { weights: ['400', '500'], subsets: ['latin'] });
loadNotoOriya('normal', { weights: ['500', '600'], subsets: ['oriya', 'latin'] });

export const fontFamilies = {
  display: cormorantFamily,
  sans: dmSansFamily,
  odia: notoOriyaFamily,
};
