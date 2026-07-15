import type { Metadata } from "next";
import GeneratorClient from "@/components/home/GeneratorClient";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: "AI Image Generator from Text",
  description:
    "Create high-quality AI images from text prompts in seconds. Generate AI artwork, social media visuals, marketing graphics and product images with Genova AI.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareApplicationSchema} />
      <GeneratorClient />
    </>
  );
}
