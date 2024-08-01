import presetWebFonts from '@unocss/preset-web-fonts';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import {
  defineConfig,
  presetAttributify,
  presetUno,
  presetWind,
  transformerDirectives,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetWind(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Roboto:400;500;700;900',
        mono: ['Fira Code:400;500;700;900', 'Fira Mono:400;500;700;900'],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: [
    ['wh-full', 'w-full h-full'],
    ['flex-center', 'flex justify-center items-center'],
    ['flex-col', 'flex flex-col'],
    ['flex-row', 'flex flex-row'],
    ['flex-row-center', 'flex flex-row items-center'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    ['flex-col-axis-center', 'flex flex-col items-center'],
    ['text-ellipsis', 'truncate'],
    ['text-standard', 'text-sm md:text-base'],
    ['text-standard-small', 'text-xs md:text-sm'],
    ['text-standard-big', 'text-base md:text-5'],
  ],
  rules: [],
  theme: {
    colors: {
      primary: '#aa3333',
      text: '#333',
      error: '#EB0000',
      success: '#008833',
    },
  },
});

