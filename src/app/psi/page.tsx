// src/app/psi/page.tsx
import { getPsiData } from "@/lib/data";
import PsiDashboard from "@/components/PsiDashboard"; // Import the new client component

export default async function PsiPage() {
  // 1. Fetch data on the server
  const psiData = await getPsiData();

  // 2. Pass the data as a prop to the client component
  return <PsiDashboard psiData={psiData} />;
}