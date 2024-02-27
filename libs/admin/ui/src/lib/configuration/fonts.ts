import { Exo_2, Roboto_Mono } from 'next/font/google';

export const base = Exo_2({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--mc-font-family-base',
});

export const mono = Roboto_Mono({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--mc-font-family-mono',
});
