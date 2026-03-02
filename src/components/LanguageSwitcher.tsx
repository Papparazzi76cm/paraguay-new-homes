import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
];

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
}

const LanguageSwitcher = ({ variant = "dark" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const baseClass = variant === "light"
    ? "text-white/70 hover:text-white hover:bg-white/10"
    : "text-muted-foreground hover:text-foreground hover:bg-muted";

  const activeClass = variant === "light"
    ? "text-white bg-white/20"
    : "text-foreground bg-muted";

  return (
    <div className="flex items-center gap-0.5 rounded-lg p-0.5">
      <Globe className={`w-4 h-4 mr-1 ${variant === "light" ? "text-white/60" : "text-muted-foreground"}`} />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            i18n.language === lang.code ? activeClass : baseClass
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
