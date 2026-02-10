// Language utilities
export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  hy: { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  ru: { code: 'ru', name: 'Russian', nativeName: 'Русский' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

const LANGUAGE_STORAGE_KEY = 'shop_language';

export function getStoredLanguage(): LanguageCode {
  // Default to English on first load / server-side (changed from 'hy' to 'en')
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored in LANGUAGES) {
      return stored as LanguageCode;
    }
  } catch {
    // Ignore errors
  }
  // Fallback language when nothing is stored (changed from 'hy' to 'en')
  return 'en';
}

export function setStoredLanguage(language: LanguageCode, options?: { skipReload?: boolean }): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    // Also set cookie for server-side access
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Dispatch event for client components to update
    window.dispatchEvent(new Event('language-updated'));
    
    // Only reload if explicitly requested (for backward compatibility)
    // By default, we don't reload - components should listen to 'language-updated' event
    if (options?.skipReload === false) {
      // Use a small delay to ensure state updates are visible before reload
      setTimeout(() => {
        window.location.reload();
      }, 50);
    }
  } catch (error) {
    console.error('Failed to save language:', error);
  }
}

