import { Suspense } from "react";
import { notFound } from "next/navigation";
import { dataProducts } from "@/lib/mock-data";
import { DatasetDetail } from "@/components/dataset/DatasetDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return dataProducts.map((p) => ({ id: p.id }));
}

export default async function DatasetPage({ params }: Props) {
  const { id } = await params;
  const product = dataProducts.find((p) => p.id === id);
  if (!product) notFound();
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-400">Loading...</div>}>
      <DatasetDetail product={product} />
    </Suspense>
  );
}
