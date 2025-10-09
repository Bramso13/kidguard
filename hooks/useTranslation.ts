import { useCallback } from 'react';
import translations from '@/locales/fr.json';

type TranslationKey = string;

interface TranslationParams {
  [key: string]: string | number;
}

export function useTranslation() {
  const t = useCallback((key: TranslationKey, params?: TranslationParams): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters in translation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || '';
      });
    }

    return value;
  }, []);

  return { t };
}