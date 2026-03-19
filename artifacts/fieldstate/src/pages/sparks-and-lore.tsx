import { useEffect, useState } from "react";
import { Reveal } from "@/components/layout/Reveal";
import { archiveCategories, archivePosts } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function SparksAndLore() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Sparks & Lore | FieldState";
  }, []);

  const filteredPosts = activeCategory 
    ? archivePosts.filter(p => p.categoryId === activeCategory)
    : archivePosts;

  return (
    <div className="pt-32 pb-24 max-w-6xl mx-auto px-6">
      <Reveal>
        <h1 className="text-5xl font-serif mb-12 text-foreground">Sparks & Lore</h1>
      </Reveal>

      {/* Filters */}
      <Reveal delay={0.2}>
        <div className="flex flex-wrap gap-4 mb-16 border-b border-border pb-8">
          <Button 
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All Manifests
          </Button>
          {archiveCategories.map(cat => (
            <Button 
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </Reveal>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="group cursor-pointer"
            >
              <div className="text-xs font-mono text-primary mb-3">
                {post.date} // {archiveCategories.find(c => c.id === post.categoryId)?.label.toUpperCase()}
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
