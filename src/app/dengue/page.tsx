// src/app/dengue/page.tsx
import { getDengueData } from "@/lib/data";
import DengueDashboard from "@/components/DengueDashboard";

export default async function DenguePage() {
  // 1. Fetch the complete data object on the server
  const dengueApiResponse = await getDengueData();

  // 2. Pass the entire object as a prop to the client component
  return <DengueDashboard initialData={dengueApiResponse} />;
}