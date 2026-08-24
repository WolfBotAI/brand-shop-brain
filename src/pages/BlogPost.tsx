import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { formatPostDate, getPostBySlug, getRelatedPosts } from "@/data/blogPosts";

const SITE = "https://brand-shop.ai";
const CHART_CAPTION =
  "Illustrative comparison across storefronts using a traditional quote-and-proof flow versus an integrated AI product designer.";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const url = `${SITE}/blog/${post.slug}`;
  const related = getRelatedPosts(post, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: `${SITE}${post.heroImage}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
      publisher: { "@type": "Organization", name: "Brand-Shop AI" },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: post.tags.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} type="article" jsonLd={jsonLd} />
      <Helmet>
        <meta property="og:image" content={`${SITE}${post.heroImage}`} />
        <meta name="twitter:image" content={`${SITE}${post.heroImage}`} />
      </Helmet>
      <Navbar />

      <div className="pt-28 pb-6">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <header className="container mx-auto px-4 text-center max-w-3xl mb-10">
        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">{post.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{post.author.name}</span> · {post.author.role}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatPostDate(post.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {post.readingTime}
          </span>
        </div>
      </header>

      <div className="container mx-auto px-4 mb-14">
        <img
          src={post.heroImage}
          alt={post.heroImageAlt}
          width={1536}
          height={1024}
          className="w-full max-h-[520px] object-cover rounded-2xl shadow-lg"
        />
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          <aside className="lg:sticky lg:top-24 h-fit space-y-6">
            <nav className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground mb-3">On this page</p>
              <ul className="space-y-2">
                {post.tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="rounded-xl bg-primary text-primary-foreground p-6">
              <p className="font-bold text-lg mb-2">See an AI-designed store in minutes</p>
              <p className="text-sm opacity-90 mb-5">
                Spin up a branded storefront with an AI product designer built in — no rebuild required.
              </p>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/signup">Start free</Link>
              </Button>
              <Link
                to="/assessment"
                className="block text-center text-sm mt-3 underline underline-offset-4 opacity-90 hover:opacity-100"
              >
                Take the assessment
              </Link>
            </div>

            {related.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground mb-3">Related articles</p>
                <ul className="space-y-4">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link to={`/blog/${item.slug}`} className="flex gap-3 group">
                        <img
                          src={item.heroImage}
                          alt={item.heroImageAlt}
                          loading="lazy"
                          className="h-14 w-20 rounded-md object-cover flex-shrink-0"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors leading-snug">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          <div>
            <article>
              <BlogMarkdown content={post.content} images={post.images} chartCaption={CHART_CAPTION} />
            </article>

            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>

            <section className="mt-14">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {post.faqs.map((faq, idx) => (
                  <AccordionItem key={faq.question} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <section className="mt-14 rounded-2xl bg-secondary text-secondary-foreground p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Build your AI-powered storefront</h2>
              <p className="opacity-80 mb-6 max-w-2xl">
                Launch branded stores with a native AI product designer, automated order routing and reporting that
                shows exactly what is selling.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/signup">Create a free account</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/features/store-builder">See the Store Builder</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-6">More articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((item) => (
                <article key={item.slug} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <Link to={`/blog/${item.slug}`}>
                    <img
                      src={item.heroImage}
                      alt={item.heroImageAlt}
                      loading="lazy"
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      {item.category}
                    </Badge>
                    <h3 className="font-bold text-foreground mb-2 leading-snug">
                      <Link to={`/blog/${item.slug}`} className="hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
