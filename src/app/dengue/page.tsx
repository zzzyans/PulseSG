// src/app/dengue/page.tsx
import { getDengueData } from "@/lib/data";
import DengueDashboard from "@/components/DengueDashboard"; // Import the new client component

export default async function DenguePage() {
  // 1. Fetch data on the server
  const dengueData = await getDengueData();

  // 2. Pass the data as a prop to the client component
  return <DengueDashboard dengueData={dengueData} />;
}