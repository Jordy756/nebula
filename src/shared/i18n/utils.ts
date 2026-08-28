import { ui } from '@shared/i18n/ui';

export const defaultLocale = 'en';
export const locales = ['en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const getCurrentLocale = (currentLocale: string | undefined): Locale => {
  return (currentLocale ?? defaultLocale) as Locale;
};

export const useTranslations = (locale: Locale) => {
  return function t<K extends keyof (typeof ui)[typeof defaultLocale]>(key: K): (typeof ui)[typeof defaultLocale][K] {
    return (ui[locale]?.[key] ?? ui[defaultLocale][key]) as (typeof ui)[typeof defaultLocale][K];
  };
};
