import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/store/ProductPages";
import { products } from "@/data/sample";

export function generateStaticParams() {
  return products.filter((p) => p.section === "fish" || p.section === "invertebrates").map((p) => ({ section: p.section, slug: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  if (section !== "fish" && section !== "invertebrates") notFound();
  return <ProductDetailPage section={section} slug={slug} />;
}
