import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "AI Image Generator",
  description: "Create AI images with Genova AI.",
  path: "/ai-image-generator",
});

export default function AiImageGeneratorPage() {
  return <main><h1>AI Image Generator</h1></main>;
}
