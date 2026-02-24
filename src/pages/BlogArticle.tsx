import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogArticles } from "@/data/blogArticles";

const BlogArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <main className="min-h-screen">
        <section className="bg-foreground">
          <Navbar />
          <div className="container pt-32 pb-20 text-center">
            <h1 className="text-3xl font-bold text-background mb-4">Artículo no encontrado</h1>
            <Link to="/blog" className="text-primary hover:underline">
              Volver al blog
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const relatedArticles = blogArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-foreground overflow-hidden">
        <Navbar />
        <div className="container pt-28 pb-16 md:pt-36 md:pb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-background/50 hover:text-background text-sm transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-background/50">
                <Calendar className="w-3 h-3" /> {article.date}
              </span>
              <span className="flex items-center gap-1 text-xs text-background/50">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-background leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary text-sm">
                {article.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium text-background text-sm">{article.author.name}</p>
                <p className="text-background/50 text-xs">{article.author.role}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      <div className="container -mt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="aspect-[2/1] rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-5">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-foreground/85 text-base md:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Share */}
            <div className="border-t border-border mt-12 pt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold text-foreground text-sm">
                  {article.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{article.author.name}</p>
                  <p className="text-muted-foreground text-xs">{article.author.role}</p>
                </div>
              </div>
              <button
                onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-secondary px-4 py-2 rounded-xl"
              >
                <Share2 className="w-4 h-4" /> Compartir
              </button>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Related articles */}
      <section className="py-12 md:py-16 bg-secondary/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Artículos relacionados</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                to={`/blog/${related.slug}`}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={related.imageUrl}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {related.category}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{related.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogArticlePage;
