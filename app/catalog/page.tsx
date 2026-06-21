import { CatalogClient } from "@/components/catalog/CatalogClient";
import { dataProducts } from "@/lib/mock-data";

export default function CatalogPage() {
  return <CatalogClient products={dataProducts} />;
}
