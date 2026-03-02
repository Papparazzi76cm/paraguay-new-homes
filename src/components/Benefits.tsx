import { motion } from "framer-motion";
import { ShieldCheck, Cuboid, GitCompare, BadgeCheck, TrendingUp, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

const benefitKeys = [
  { icon: ShieldCheck, titleKey: "benefits.newBuild", descKey: "benefits.newBuildDesc" },
  { icon: BadgeCheck, titleKey: "benefits.verified", descKey: "benefits.verifiedDesc" },
  { icon: Cuboid, titleKey: "benefits.renders", descKey: "benefits.rendersDesc" },
  { icon: GitCompare, titleKey: "benefits.comparator", descKey: "benefits.comparatorDesc" },
  { icon: TrendingUp, titleKey: "benefits.simulator", descKey: "benefits.simulatorDesc" },
  { icon: CreditCard, titleKey: "benefits.financing", descKey: "benefits.financingDesc" },
];

const Benefits = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t("benefits.tag")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{t("benefits.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("benefits.subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitKeys.map((b, i) => (
            <motion.div
              key={b.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-card rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t(b.titleKey)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{t(b.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
