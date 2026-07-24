import type { Translations } from "@webapp-factory/shared/i18n";
import de from "./de.js";
import en from "./en.js";

/** Available patchworkheroes.de locales mapped to their dictionaries. */
export const dictionaries: Readonly<Record<string, Translations>> = { de, en };

/**
 * Load the dictionary for a locale.
 * Falls back to the German dictionary for unknown locales.
 */
export function getDictionary(locale: string): Translations {
  return dictionaries[locale] ?? de;
}
