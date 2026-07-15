import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "AI-Generated Image Gallery and Prompt Examples",
  description: "Explore AI-generated artwork, realistic images, product concepts and creative prompt examples made with Genova AI.",
  path: "/gallery",
});

export default function GalleryPage() {
  return <main><h1>Gallery</h1></main>;
}
