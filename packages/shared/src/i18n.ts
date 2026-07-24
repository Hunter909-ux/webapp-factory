/**
 * Lightweight i18n translation helper.
 *
 * Dictionaries live in each Astro site (src/i18n/en.ts, src/i18n/de.ts).
 * This shared helper just provides a type-safe `t(key)` function once a
 * dictionary is loaded.
 */

/** A flat or nested record of translation strings. */
export interface Translations {
  readonly [key: string]: string | Translations;
}

/**
 * Returns a translator for the given dictionary and language.
 *
 * @param dictionary Complete translation record for the active language.
 * @returns Function that resolves a dot-notation key or returns the key itself.
 */
export function useTranslations(dictionary: Translations): (key: string) => string {
  return (key: string): string => {
    const parts = key.split(".");
    let value: string | Translations | undefined = dictionary;
    for (const part of parts) {
      if (value === undefined || typeof value === "string") {
        return key;
      }
      value = value[part];
    }
    return typeof value === "string" ? value : key;
  };
}

/** One selectable language with its localized link. */
export interface LanguageLink {
  code: string;
  label: string;
  href: string;
}

/**
 * Build a localized URL path given the current path and the target locale.
 *
 * The default locale never receives a prefix; all other locales get a prefix.
 * The current locale is stripped from the path before the target prefix is
 * applied, so switching from `/de/blog/` to English yields `/blog/` and
 * vice-versa.
 *
 * @param currentPath Path from the current URL (e.g. `/de/blog/`).
 * @param targetLocale Locale to switch to (e.g. `"en"`).
 * @param defaultLocale The default locale for this site (e.g. `"en"`).
 * @returns Localized path, always starting with `/`.
 */
export function localizePath(
  currentPath: string,
  targetLocale: string,
  defaultLocale: string,
): string {
  // Remove any leading locale segment from the current path.
  const localePattern = /^\/[a-z]{2}(?=\/|$)/;
  const stripped = currentPath.replace(localePattern, "") || "/";

  if (targetLocale === defaultLocale) {
    return stripped;
  }

  return stripped === "/" ? `/${targetLocale}/` : `/${targetLocale}${stripped}`;
}

/**
 * Build the language switch links for a page.
 */
export function getLanguageLinks(
  currentPath: string,
  locales: readonly string[],
  labels: Readonly<Record<string, string>>,
  defaultLocale: string,
): LanguageLink[] {
  return locales.map((locale) => ({
    code: locale,
    label: labels[locale] ?? locale.toUpperCase(),
    href: localizePath(currentPath, locale, defaultLocale),
  }));
}
