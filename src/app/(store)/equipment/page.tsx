import { ProductListingPage } from "@/components/store/ProductPages";

export default async function Page({ searchParams }: { searchParams: Promise<{ sub?: string }> }) {
  const { sub } = await searchParams;
  return <ProductListingPage section="equipment" sub={sub} />;
}
