import { notFound } from "next/navigation";
import { ProductListingPage } from "@/components/store/ProductPages";

export function generateStaticParams() {
  return [{ section: "fish" }, { section: "invertebrates" }];
}

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (section !== "fish" && section !== "invertebrates") notFound();
  return <ProductListingPage section={section} />;
}
