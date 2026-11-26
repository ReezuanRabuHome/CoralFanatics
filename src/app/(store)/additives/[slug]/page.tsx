import { ProductDetailPage } from "@/components/store/ProductPages";
import { products } from "@/data/sample";

export function generateStaticParams() {
  return products.filter((p) => p.section === "additives").map((p) => ({ slug: p.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailPage section="additives" slug={slug} />;
}
