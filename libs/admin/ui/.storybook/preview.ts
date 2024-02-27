import { withThemeByClassName } from '@storybook/addon-styling';
import * as fonts from '../src/lib/configuration/fonts';
import '../src/lib/configuration/global-styles.css';

export const decorators = [
  withThemeByClassName({
    parentSelector: 'html',
    themes: {
      light: [fonts.base.variable, fonts.mono.variable].join(' '),
      dark: ['dark', fonts.base.variable, fonts.mono.variable].join(' '),
    },
    defaultTheme: 'light',
  }),
];

export const parameters = {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: '/',
    },
  },
};
