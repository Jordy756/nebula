import { ui } from '@i18n/ui.ts';

export const defaultLocale = 'en';
export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const getCurrentLocale = (currentLocale: string | undefined): Locale => {
  return (currentLocale ?? defaultLocale) as Locale;
};

export const useTranslations = (locale: Locale) => {
  return function t(key: keyof (typeof ui)[typeof defaultLocale]) {
    return ui[locale]?.[key] ?? ui[defaultLocale][key];
  };
};
