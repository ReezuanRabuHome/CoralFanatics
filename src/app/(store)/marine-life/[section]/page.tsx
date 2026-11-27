import { notFound } from "next/navigation";
import { ProductListingPage } from "@/components/store/ProductPages";

export default async function Page({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ sub?: string }> }) {
  const { section } = await params;
  const { sub } = await searchParams;
  if (section !== "fish" && section !== "invertebrates") notFound();
  return <ProductListingPage section={section} sub={sub} />;
}
