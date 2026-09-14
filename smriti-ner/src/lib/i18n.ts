/**
 * Smriti-NER (স্মৃতি) — Core Internationalization (i18n) Engine
 * Sub-Phase 6.2: Localization Framework
 * Problem Statement 26003 | MDoNER & SIH 2026
 * 
 * Supports 8 North Eastern Languages with zero network lag:
 * Assamese (as), Meitei (mni), Bengali (bn), Bodo (brx), Khasi (kha), Mizo (lus), Hindi (hi), English (en).
 */

import { useState, useEffect } from "react";
import asLocale from "../locales/as.json";
import mniLocale from "../locales/mni.json";
import bnLocale from "../locales/bn.json";
import brxLocale from "../locales/brx.json";
import khaLocale from "../locales/kha.json";
import lusLocale from "../locales/lus.json";
import hiLocale from "../locales/hi.json";
import enLocale from "../locales/en.json";

export type LocaleCode = "as" | "mni" | "bn" | "brx" | "kha" | "lus" | "hi" | "en";

export type KinshipRelation = "grandmother" | "grandfather" | "mother" | "father" | "elder";

export const LOCALES: Record<LocaleCode, typeof enLocale> = {
  as: asLocale as typeof enLocale,
  mni: mniLocale as typeof enLocale,
  bn: bnLocale as typeof enLocale,
  brx: brxLocale as typeof enLocale,
  kha: khaLocale as typeof enLocale,
  lus: lusLocale as typeof enLocale,
  hi: hiLocale as typeof enLocale,
  en: enLocale,
};

export const LANGUAGE_METADATA: Record<
  LocaleCode,
  {
    name: string;
    nativeName: string;
    script: string;
    fontFamily: string;
    direction: "ltr";
  }
> = {
  as: {
    name: "Assamese",
    nativeName: "অসমীয়া",
    script: "Bengali / Asamiya",
    fontFamily: "'Noto Sans Bengali', sans-serif",
    direction: "ltr",
  },
  mni: {
    name: "Meitei / Manipuri",
    nativeName: "ꯃꯤꯇꯩꯂꯣꯟ",
    script: "Meitei Mayek",
    fontFamily: "'Noto Sans Meetei Mayek', sans-serif",
    direction: "ltr",
  },
  bn: {
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    fontFamily: "'Noto Sans Bengali', sans-serif",
    direction: "ltr",
  },
  brx: {
    name: "Bodo",
    nativeName: "बड़ो",
    script: "Devanagari",
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    direction: "ltr",
  },
  kha: {
    name: "Khasi",
    nativeName: "Ka Ktien Khasi",
    script: "Latin",
    fontFamily: "'Inter', sans-serif",
    direction: "ltr",
  },
  lus: {
    name: "Mizo",
    nativeName: "Mizo ṭawng",
    script: "Latin (with ṭ and tone accents)",
    fontFamily: "'Inter', sans-serif",
    direction: "ltr",
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    fontFamily: "'Noto Sans Devanagari', sans-serif",
    direction: "ltr",
  },
  en: {
    name: "English",
    nativeName: "English",
    script: "Latin",
    fontFamily: "'Inter', sans-serif",
    direction: "ltr",
  },
};

export class I18nEngine {
  private static currentLang: LocaleCode = "as";
  private static STORAGE_KEY = "smriti_preferred_language";

  public static initialize(): LocaleCode {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(this.STORAGE_KEY) as LocaleCode | null;
      if (stored && LOCALES[stored]) {
        this.currentLang = stored;
        document.documentElement.lang = stored;
        return stored;
      }
    }
    return this.currentLang;
  }

  public static getCurrentLanguage(): LocaleCode {
    return this.currentLang;
  }

  public static setLanguage(lang: LocaleCode): void {
    if (!LOCALES[lang]) return;
    this.currentLang = lang;

    if (typeof window !== "undefined") {
      if (window.localStorage) {
        window.localStorage.setItem(this.STORAGE_KEY, lang);
      }
      document.documentElement.lang = lang;
      window.dispatchEvent(
        new CustomEvent("smriti:language_change", {
          detail: { language: lang, metadata: LANGUAGE_METADATA[lang] },
        })
      );
    }
  }

  /**
   * Resolves a dotted translation key with optional interpolation:
   * t("home.greeting", { name: "Dipali", kinship: "আইতা" })
   */
  public static t(
    path: string,
    params?: Record<string, string | number>,
    langOverride?: LocaleCode
  ): string {
    const lang = langOverride || this.currentLang;
    const localeDict = LOCALES[lang] || LOCALES.en;

    const parts = path.split(".");
    let current: unknown = localeDict;

    for (const part of parts) {
      if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        // Fallback to English catalog
        let fbCurrent: unknown = LOCALES.en;
        for (const fbPart of parts) {
          if (fbCurrent && typeof fbCurrent === "object" && fbPart in (fbCurrent as Record<string, unknown>)) {
            fbCurrent = (fbCurrent as Record<string, unknown>)[fbPart];
          } else {
            fbCurrent = null;
            break;
          }
        }
        current = fbCurrent ?? path;
        break;
      }
    }

    if (typeof current !== "string") {
      return path;
    }

    // Interpolation replacement for {param}
    if (params) {
      let resolved = current;
      for (const [k, v] of Object.entries(params)) {
        resolved = resolved.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
      return resolved;
    }

    return current;
  }

  /**
   * Resolves cultural kinship honorific (e.g. Aita, Iben, Dida, Aabou)
   */
  public static getKinshipHonorific(
    relation: KinshipRelation = "elder",
    langOverride?: LocaleCode
  ): string {
    const lang = langOverride || this.currentLang;
    const dict = LOCALES[lang]?.honorifics || LOCALES.en.honorifics;
    return dict[relation] || dict.elder;
  }
}

/**
 * React Hook for seamless component translation & runtime switching
 */
export function useTranslation() {
  const [lang, setLang] = useState<LocaleCode>(I18nEngine.getCurrentLanguage());

  useEffect(() => {
    // Sync initial state
    setLang(I18nEngine.getCurrentLanguage());

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ language: LocaleCode }>;
      if (customEvent.detail?.language) {
        setLang(customEvent.detail.language);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("smriti:language_change", handleLangChange);
      return () => {
        window.removeEventListener("smriti:language_change", handleLangChange);
      };
    }
  }, []);

  return {
    t: (path: string, params?: Record<string, string | number>) => I18nEngine.t(path, params, lang),
    currentLanguage: lang,
    languageMetadata: LANGUAGE_METADATA[lang],
    setLanguage: (newLang: LocaleCode) => I18nEngine.setLanguage(newLang),
    getKinship: (relation: KinshipRelation) => I18nEngine.getKinshipHonorific(relation, lang),
  };
}
