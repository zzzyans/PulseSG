// src/app/api/dispatch-psi-alert/route.ts
import { NextResponse } from "next/server";
import { sendTargetedSms } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const { region, psi, descriptor } = await request.json();
    if (!region || psi === undefined || !descriptor) {
      return NextResponse.json(
        { message: "Missing region, psi, or descriptor data." },
        { status: 400 }
      );
    }

    // Construct a tailored SMS message for PSI alerts
    let messageBody = `SG Health Alert: The 24-hour PSI reading in the ${region} region is now ${psi} (${descriptor}).`;

    if (psi > 100) {
      messageBody += " Residents are advised to reduce prolonged or strenuous outdoor physical exertion.";
    } else if (psi > 50) {
      messageBody += " Healthy persons can continue with normal activities.";
    }

    // The area to target is the region name itself.
    // This assumes citizens subscribe with an area like "North", "South", etc.
    const targetArea = region;

    // Reuse the existing SMS sending function
    sendTargetedSms(targetArea, messageBody);

    return NextResponse.json(
      { message: `PSI alert dispatch initiated for ${region} region.` },
      { status: 202 } // Accepted
    );
  } catch (error) {
    console.error("Failed to dispatch PSI alert:", error);
    return NextResponse.json(
      { message: "Failed to dispatch PSI alert." },
      { status: 500 }
    );
  }
}
