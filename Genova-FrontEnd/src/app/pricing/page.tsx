import { createMetadata } from "@/lib/metadata";
import PricingClient from "./PricingClient";

export const metadata = createMetadata({
  title: "AI Image Generator Pricing and Credits",
  description:
    "Compare Genova AI pricing plans and image-generation credit packages for personal, creative and professional projects.",
  path: "/pricing",
});

export default function PricingPage() {
  return <PricingClient />;
}
