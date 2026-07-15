export type Post = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  content: string; // Added content field for the UI
};

const MOCK_POSTS: Post[] = [
  {
    slug: "how-to-write-perfect-prompts",
    title: "How to Write the Perfect Prompt for AI Image Generation",
    description: "Learn the secrets of prompt engineering to consistently generate exactly the image you have in your head.",
    image: "https://images.unsplash.com/photo-1673809228800-47b19ce8aeb0?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "A person typing on a glowing keyboard",
    publishedAt: "2024-03-15T08:00:00Z",
    authorName: "Genova Team",
    content: `
      ## The Art of Prompting
      Writing good prompts is less about coding and more about descriptive storytelling. The AI needs specific details to understand your vision.

      ### 1. Subject and Scene
      Always start with a clear subject. Instead of saying "a dog," say "a golden retriever sitting in a sunlit park."

      ### 2. Style and Medium
      Tell the AI *how* to render it. Add keywords like "oil painting," "cinematic photography," "3D render," or "anime style."

      ### 3. Lighting and Atmosphere
      Lighting drastically changes the mood. Use phrases like "golden hour," "neon cyberpunk lighting," or "soft dramatic shadows."
    `,
  },
  {
    slug: "midjourney-vs-genova",
    title: "Midjourney vs Genova AI: Which Should You Choose?",
    description: "A comprehensive comparison between Midjourney and Genova AI for creators and businesses.",
    image: "https://images.unsplash.com/photo-1684369175833-8a9d044f77c8?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Futuristic robot looking at a screen",
    publishedAt: "2024-04-02T10:30:00Z",
    authorName: "Genova Team",
    content: `
      ## The AI Image Landscape
      With so many AI image generators available, choosing the right one can be overwhelming. Today we compare two giants.

      ### Ease of Use
      Midjourney requires using Discord, which has a steep learning curve. Genova AI offers a clean, dedicated web interface.

      ### Speed and Consistency
      Genova's backend is optimized for sub-second generation, perfect for rapidly prototyping ideas.
    `,
  },
  {
    slug: "ai-art-copyright-guide",
    title: "Understanding Copyright for AI-Generated Art",
    description: "Can you sell AI art? Who owns the copyright? We break down the latest legal landscape.",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Gavel resting on a wooden desk",
    publishedAt: "2024-05-10T14:15:00Z",
    authorName: "Genova Team",
    content: `
      ## Commercial Use
      One of the most common questions we get is: "Can I use Genova AI images commercially?" The short answer is yes!

      ### Public Domain vs Copyright
      Currently, in many jurisdictions, AI-generated images themselves cannot be copyrighted because they lack "human authorship." However, if you significantly modify the image, you may be able to claim copyright on your edited version.
    `,
  }
];

export async function getAllPosts(): Promise<Post[]> {
  return MOCK_POSTS;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return MOCK_POSTS.find((p) => p.slug === slug);
}
