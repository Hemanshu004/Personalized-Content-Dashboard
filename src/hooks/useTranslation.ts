'use client';

import { useAppSelector } from '@/store/hooks';
import { selectLanguage } from '@/features/ui/uiSlice';
import { en } from '@/locales/en';
import { hi } from '@/locales/hi';

const translations = { en, hi };

export function useTranslation() {
  const language = useAppSelector(selectLanguage);
  
  const t = (key: keyof typeof en) => {
    return translations[language][key] || en[key];
  };

  return { t, language };
}
