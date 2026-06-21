import { UseCaseFitClient } from "@/components/use-case-fit/UseCaseFitClient";
import { dataProducts, useCaseDefinitions } from "@/lib/mock-data";

export default function UseCaseFitPage() {
  return <UseCaseFitClient products={dataProducts} useCases={useCaseDefinitions} />;
}
