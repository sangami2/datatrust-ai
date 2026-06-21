import { IncidentsClient } from "@/components/incidents/IncidentsClient";
import { incidents } from "@/lib/mock-data";

export default function IncidentsPage() {
  return <IncidentsClient incidents={incidents} />;
}
