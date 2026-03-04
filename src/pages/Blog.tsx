import { motion } from "framer-motion";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSignup from "@/components/NewsletterSignup";
import { blogArticles } from "@/data/blogArticles";

const categories = ["Todos", ...Array.from(new Set(blogArticles.map((a) => a.category)))];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered =
    activeCategory === "Todos"
      ? blogArticles
      : blogArticles.filter((a) => a.category === activeCategory);

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Blog | Tekoha — Insights del mercado inmobiliario</title>
        <meta name="description" content="Análisis, guías y tendencias para tomar mejores decisiones de inversión en el sector inmobiliario de Paraguay." />
        <meta property="og:title" content="Blog | Tekoha" />
        <meta property="og:description" content="Insights del mercado inmobiliario paraguayo: análisis, guías y tendencias." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/blog" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(160,35%,25%,0.12),_transparent_60%)]" />
        <Navbar />
        <div className="container pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
              Insights del mercado inmobiliario{" "}
              <span className="text-primary">paraguayo</span>
            </h1>
            <p className="text-background/60 text-lg md:text-xl leading-relaxed max-w-2xl">
              Análisis, guías y tendencias para tomar mejores decisiones de inversión en el sector
              inmobiliario de Paraguay.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-border sticky top-0 z-30 bg-background/80 backdrop-blur-xl">
        <div className="container py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          {/* Featured (first article) */}
          {filtered.length > 0 && (
            <motion.a
              {...fadeUp}
              href={`/blog/${filtered[0].slug}`}
              className="group grid md:grid-cols-2 gap-6 mb-12 bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow"
            >
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={filtered[0].imageUrl}
                  alt={filtered[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {filtered[0].category}
                  </span>
                  <span className="text-xs text-muted-foreground">{filtered[0].date}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {filtered[0].readTime}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {filtered[0].title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{filtered[0].excerpt}</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-semibold text-foreground text-xs">
                    {filtered[0].author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-xs">{filtered[0].author.name}</p>
                    <p className="text-muted-foreground text-xs">{filtered[0].author.role}</p>
                  </div>
                </div>
              </div>
            </motion.a>
          )}

          {/* Rest of articles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(1).map((article, i) => (
              <motion.a
                key={article.slug}
                href={`/blog/${article.slug}`}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Leer más <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No hay artículos en esta categoría todavía.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-16 md:pb-24">
        <div className="container">
          <NewsletterSignup />
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
