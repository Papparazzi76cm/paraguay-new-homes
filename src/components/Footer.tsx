import { MapPin, Mail, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import takohaLogo from "@/assets/takoha-logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-foreground py-16">
      <div className="container">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img src={takohaLogo} alt="Takoha" className="h-40 w-auto brightness-0 invert" />
            </div>
            <p className="text-background/50 text-sm leading-relaxed">{t("footer.brandDesc")}</p>
          </div>

          <div>
            <h4 className="text-background font-semibold text-sm mb-4 font-sans">{t("footer.explore")}</h4>
            <ul className="space-y-2.5">
              {[t("footer.exploreProjects"), t("footer.exploreNew"), t("footer.exploreOpportunities"), t("footer.exploreComparator"), t("footer.exploreBlog")].map((item) => (
                <li key={item}>
                  <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold text-sm mb-4 font-sans">{t("footer.forDevelopers")}</h4>
            <ul className="space-y-2.5">
              {[t("footer.publish"), t("footer.plans"), t("footer.dashboard"), t("footer.support")].map((item) => (
                <li key={item}>
                  <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-background font-semibold text-sm mb-4 font-sans">{t("footer.contactTitle")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/50 text-sm">
                <MapPin className="w-4 h-4 shrink-0" /> Asunción, Paraguay
              </li>
              <li className="flex items-center gap-2 text-background/50 text-sm">
                <Mail className="w-4 h-4 shrink-0" /> info@takoha.estate
              </li>
              <li className="flex items-center gap-2 text-background/50 text-sm">
                <Phone className="w-4 h-4 shrink-0" /> +595 21 000 0000
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-sm">{t("footer.rights")}</p>
          <div className="flex gap-6">
            {[t("footer.terms"), t("footer.privacy"), t("footer.cookies")].map((item) => (
              <a key={item} href="#" className="text-background/40 hover:text-background/60 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
