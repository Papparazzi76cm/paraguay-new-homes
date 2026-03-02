import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const cache = new Map<string, string>();

export const useTranslatedText = (text: string | null | undefined) => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "es";
  const [translated, setTranslated] = useState(text || "");
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!text || lang === "es") {
      setTranslated(text || "");
      return;
    }

    const cacheKey = `${lang}:${text.slice(0, 50)}`;
    if (cache.has(cacheKey)) {
      setTranslated(cache.get(cacheKey)!);
      return;
    }

    let cancelled = false;
    setIsTranslating(true);

    supabase.functions
      .invoke("translate", { body: { text, targetLang: lang } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data?.translated) {
          cache.set(cacheKey, data.translated);
          setTranslated(data.translated);
        } else {
          setTranslated(text);
        }
      })
      .catch(() => {
        if (!cancelled) setTranslated(text);
      })
      .finally(() => {
        if (!cancelled) setIsTranslating(false);
      });

    return () => { cancelled = true; };
  }, [text, lang]);

  return { translated, isTranslating };
};
