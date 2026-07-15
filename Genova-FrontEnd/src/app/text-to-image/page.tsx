import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Text to Image AI Generator Online",
  description: "Turn written ideas into original images with Genova AI's text-to-image generator.",
  path: "/text-to-image",
});

export default function TextToImagePage() {
  return <main><h1>Text to Image Generator</h1></main>;
}
