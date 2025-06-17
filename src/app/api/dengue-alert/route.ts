// src/app/api/dispatch-dengue-alert/route.ts
import { NextResponse } from "next/server";
import { sendDengueAlert } from "@/lib/sms";

export async function POST(request: Request) {
  const { area, cases } = await request.json();
  const messageBody = `SG Health Alert: A high-risk dengue cluster with ${cases} cases has been identified in your area (${area}). Please take immediate precautions.`;
  
  // Call the new specific function
  sendDengueAlert(area, messageBody);

  return NextResponse.json({ message: `Dengue alert dispatch initiated for ${area}.` }, { status: 202 });
}