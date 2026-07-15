import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "AI Blog & Guides",
  description: "Learn how to use AI image generators, prompt engineering, and more.",
  path: "/blog",
});

export default function BlogPage() {
  return <main><h1>Blog</h1></main>;
}
