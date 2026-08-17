import { Link } from "react-router-dom";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { blogPosts, formatPostDate } from "@/data/blogPosts";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog | AI Storefront & Custom Apparel Guides"
        description="Guides, data and playbooks on AI product designers, custom apparel storefronts, order routing and multi-store management for decorators and distributors."
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "The Brand-Shop AI Blog",
          url: "https://brand-shop.ai/blog",
          description:
            "Guides on AI-powered custom apparel storefronts for decorators, distributors and referral partners.",
          publisher: { "@type": "Organization", name: "Brand-Shop AI" },
          blogPost: blogPosts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            url: `https://brand-shop.ai/blog/${post.slug}`,
          })),
        }}
      />
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Badge className="mb-5">The Brand-Shop AI Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
            Guides for AI-powered custom apparel storefronts
          </h1>
          <p className="text-lg text-muted-foreground">
            Practical, data-backed articles for decorators, distributors and referral partners building modern
            online stores — from AI product designers and mockup generators to order routing and reporting.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <img
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-52 object-cover"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <Badge variant="secondary" className="w-fit mb-3">
                    {post.category}
                  </Badge>
                  <h2 className="text-xl font-bold text-foreground mb-3 leading-snug">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6 flex-1">{post.excerpt}</p>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">{post.author.name}</p>
                    <p>
                      {formatPostDate(post.publishedAt)} · {post.readingTime}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
