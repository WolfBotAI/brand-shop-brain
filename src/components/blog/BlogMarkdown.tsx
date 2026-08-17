import { Fragment, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { BlogImage } from "@/data/blogPosts";
import { StorefrontImpactChart } from "./StorefrontImpactChart";

export const slugifyHeading = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const renderInline = (text: string, keyPrefix: string): ReactNode[] => {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(<em key={`${keyPrefix}-i${i}`}>{token.slice(1, -1)}</em>);
    } else {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        if (href.startsWith("/")) {
          nodes.push(
            <Link key={`${keyPrefix}-l${i}`} to={href} className="text-primary font-medium underline underline-offset-4 hover:text-primary/80">
              {label}
            </Link>
          );
        } else {
          nodes.push(
            <a
              key={`${keyPrefix}-l${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline underline-offset-4 hover:text-primary/80"
            >
              {label}
            </a>
          );
        }
      }
    }
    lastIndex = match.index + token.length;
    i += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`${keyPrefix}-t${i}`}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
};

interface BlogMarkdownProps {
  content: string;
  images: Record<string, BlogImage>;
  chartCaption?: string;
}

export const BlogMarkdown = ({ content, images, chartCaption }: BlogMarkdownProps) => {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];

  let bullets: string[] = [];
  let numbers: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (!bullets.length) return;
    const items = bullets;
    bullets = [];
    blocks.push(
      <ul key={`ul-${key++}`} className="my-6 space-y-3 pl-5 list-disc marker:text-primary">
        {items.map((item, idx) => (
          <li key={idx} className="text-muted-foreground leading-relaxed">
            {renderInline(item, `ul-${key}-${idx}`)}
          </li>
        ))}
      </ul>
    );
  };

  const flushNumbers = () => {
    if (!numbers.length) return;
    const items = numbers;
    numbers = [];
    blocks.push(
      <ol key={`ol-${key++}`} className="my-6 space-y-3 pl-5 list-decimal marker:text-primary marker:font-semibold">
        {items.map((item, idx) => (
          <li key={idx} className="text-muted-foreground leading-relaxed">
            {renderInline(item, `ol-${key}-${idx}`)}
          </li>
        ))}
      </ol>
    );
  };

  const flushAll = () => {
    flushBullets();
    flushNumbers();
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      return;
    }

    if (line.startsWith("## ")) {
      flushAll();
      const title = line.slice(3).trim();
      blocks.push(
        <h2
          key={`h2-${key++}`}
          id={slugifyHeading(title)}
          className="scroll-mt-24 mt-12 mb-4 border-l-4 border-primary pl-4 text-2xl md:text-3xl font-bold text-foreground"
        >
          {title}
        </h2>
      );
      return;
    }

    if (line.startsWith("### ")) {
      flushAll();
      blocks.push(
        <h3 key={`h3-${key++}`} className="mt-8 mb-3 text-xl font-semibold text-foreground">
          {line.slice(4).trim()}
        </h3>
      );
      return;
    }

    if (line === "[chart]") {
      flushAll();
      blocks.push(
        <figure key={`chart-${key++}`} className="my-10">
          <StorefrontImpactChart />
          {chartCaption && (
            <figcaption className="mt-3 text-sm text-center text-muted-foreground">{chartCaption}</figcaption>
          )}
        </figure>
      );
      return;
    }

    const imageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line);
    if (imageMatch) {
      flushAll();
      const [, alt, imageKey] = imageMatch;
      const image = images[imageKey];
      if (image) {
        blocks.push(
          <figure key={`img-${key++}`} className="my-10">
            <img
              src={image.src}
              alt={image.alt || alt}
              loading="lazy"
              decoding="async"
              width={1536}
              height={1024}
              className="w-full rounded-xl shadow-md"
            />
            {image.caption && (
              <figcaption className="mt-3 text-sm text-center text-muted-foreground">{image.caption}</figcaption>
            )}
          </figure>
        );
      }
      return;
    }

    if (line.startsWith("- ")) {
      flushNumbers();
      bullets.push(line.slice(2).trim());
      return;
    }

    const numbered = /^\d+\.\s+(.*)$/.exec(line);
    if (numbered) {
      flushBullets();
      numbers.push(numbered[1]);
      return;
    }

    flushAll();
    blocks.push(
      <p key={`p-${key++}`} className="my-5 text-muted-foreground leading-relaxed text-[1.05rem]">
        {renderInline(line, `p-${key}`)}
      </p>
    );
  });

  flushAll();

  return <div>{blocks}</div>;
};
