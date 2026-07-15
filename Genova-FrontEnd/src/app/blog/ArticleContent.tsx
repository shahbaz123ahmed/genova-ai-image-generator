// src/components/blog/ArticleContent.tsx

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

type ArticleContentProps = {
  content: string;
};

export default function ArticleContent({
  content,
}: ArticleContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        h2: ({ children, ...props }: any) => (
          <h2
            className="mt-14 scroll-mt-28 text-3xl font-bold tracking-tight text-white"
            {...props}
          >
            {children}
          </h2>
        ),

        h3: ({ children, ...props }: any) => (
          <h3
            className="mt-10 scroll-mt-28 text-2xl font-bold text-white"
            {...props}
          >
            {children}
          </h3>
        ),

        p: ({ children, ...props }: any) => (
          <p
            className="mt-5 text-base leading-8 text-gray-300 sm:text-lg"
            {...props}
          >
            {children}
          </p>
        ),

        ul: ({ children, ...props }: any) => (
          <ul
            className="mt-5 list-disc space-y-2 pl-6 text-gray-300"
            {...props}
          >
            {children}
          </ul>
        ),

        ol: ({ children, ...props }: any) => (
          <ol
            className="mt-5 list-decimal space-y-2 pl-6 text-gray-300"
            {...props}
          >
            {children}
          </ol>
        ),

        blockquote: ({ children, ...props }: any) => (
          <blockquote
            className="my-8 border-l-4 border-neon bg-neon/[0.05] px-6 py-4 text-gray-300"
            {...props}
          >
            {children}
          </blockquote>
        ),

        a: ({ children, href, ...props }: any) => (
          <a
            href={href}
            className="font-semibold text-cyber underline decoration-cyber/30 underline-offset-4 transition-colors hover:text-neon"
            {...props}
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}