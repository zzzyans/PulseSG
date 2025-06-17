// src/app/api/dispatch-alert/route.ts
import { NextResponse } from "next/server";
import { sendTargetedSms } from "@/lib/sms"; 

export async function POST(request: Request) {
  try {
    const { area, cases } = await request.json();
    if (!area || cases === undefined) {
      return NextResponse.json({ message: "Missing area or cases data." }, { status: 400 });
    }

    // Construct the SMS message body
    const messageBody = `SG Health Alert: A high-risk dengue cluster with ${cases} cases has been identified in the ${area} area. Please take immediate precautions.`;

    // Dispatch the SMS
    sendTargetedSms(area, messageBody);

    return NextResponse.json(
      { message: `SMS alert dispatch initiated for ${area}.` },
      { status: 202 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Failed to dispatch alert." }, { status: 500 });
  }
}