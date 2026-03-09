import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sun, Moon, Monitor, Shield, UserCog } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth, useIsAdmin, useIsDeveloper } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import AnimatedLogo from "./AnimatedLogo";

const ThemeIcon = ({ theme }: { theme: string }) => {
  if (theme === "dark") return <Sun className="w-5 h-5" />;
  if (theme === "light") return <Moon className="w-5 h-5" />;
  return <Monitor className="w-5 h-5" />;
};

const nextTheme = (current: string) => {
  const order = ["light", "dark", "system"] as const;
  const idx = order.indexOf(current as any);
  return order[(idx + 1) % 3];
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin(user ? user.id : undefined);
  const { isDeveloper } = useIsDeveloper(user ? user.id : undefined);
  const { t } = useTranslation();
  const showPreferences = !!user && !isAdmin && !isDeveloper;

  const navItems = [
    { label: t("nav.projects"), href: "/#proyectos" },
    { label: "Che Róga Porã", href: "/che-roga-pora" },
    { label: t("nav.investment"), href: "/inversion" },
    { label: "Promotores", href: "/promotores" },
    { label: t("nav.forDevelopers"), href: "/para-promotores" },
    { label: t("nav.blog"), href: "/blog" },
  ];

  const themeTitle = theme === "system" ? t("nav.themeSystem") : theme === "dark" ? t("nav.themeDark") : t("nav.themeLight");

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="container flex items-center justify-between py-5">
        <a href="/" className="flex items-center">
          <AnimatedLogo className="h-20 md:h-14 lg:h-24" />
        </a>

        {/* Desktop / Tablet */}
        <div className="hidden md:flex items-center gap-3 lg:gap-6">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-white/80 hover:text-white text-xs lg:text-sm font-medium transition-colors whitespace-nowrap">
              {item.label}
            </a>
          ))}
          <LanguageSwitcher variant="light" />
          <button
            onClick={() => setTheme(nextTheme(theme))}
            className="p-1.5 lg:p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
            title={themeTitle}
          >
            <ThemeIcon theme={theme} />
          </button>
          {showPreferences && (
            <Link to="/mis-preferencias" className="flex items-center gap-1 text-white/80 hover:text-white text-xs lg:text-sm font-medium transition-colors whitespace-nowrap">
              <UserCog className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Mis preferencias
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 text-white/80 hover:text-white text-xs lg:text-sm font-medium transition-colors whitespace-nowrap">
              <Shield className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> {t("nav.admin")}
            </Link>
          )}
          <Link to={isDeveloper ? "/developer/projects/new" : "/auth?role=developer"} className="bg-white/10 backdrop-blur-sm text-white px-3 lg:px-5 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors whitespace-nowrap">
            {t("nav.publishProject")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setTheme(nextTheme(theme))}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle theme"
            title={themeTitle}
          >
            <ThemeIcon theme={theme} />
          </button>
          <button className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-foreground/95 backdrop-blur-xl px-6 pb-6">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-primary-foreground/80 hover:text-primary-foreground text-base font-medium py-2" onClick={() => setMobileOpen(false)}>
                {item.label}
              </a>
            ))}
            <LanguageSwitcher variant="dark" />
            {showPreferences && (
              <Link to="/mis-preferencias" className="text-primary-foreground/80 hover:text-primary-foreground text-base font-medium py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <UserCog className="w-4 h-4" /> Mis preferencias
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-primary-foreground/80 hover:text-primary-foreground text-base font-medium py-2 flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Shield className="w-4 h-4" /> {t("nav.adminPanel")}
              </Link>
            )}
            <Link to={isAdmin ? "/admin/projects/new" : isDeveloper ? "/developer/projects/new" : "/auth?role=developer"} className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-medium mt-2 block text-center" onClick={() => setMobileOpen(false)}>
              {t("nav.publishProject")}
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
