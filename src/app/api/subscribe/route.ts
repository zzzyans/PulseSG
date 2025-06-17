// src/app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const { phoneNumber, location, region } = await request.json();
    if (!phoneNumber || !location || !region) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }
    await saveSubscriber(phoneNumber, location, region);
    return NextResponse.json({ message: "Subscriber saved." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to save subscriber." }, { status: 500 });
  }
}