export type Post = {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
};

export async function getAllPosts(): Promise<Post[]> {
  // Stub for now.
  return [];
}

export async function getPost(slug: string): Promise<Post | undefined> {
  // Stub for now.
  return undefined;
}
