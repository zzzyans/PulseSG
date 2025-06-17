// src/lib/sms.ts
import twilio from "twilio";
import fs from "fs/promises";
import path from "path";

// Read credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio credentials are not configured in .env.local");
}

const client = twilio(accountSid, authToken);
const dbPath = path.join(process.cwd(), "db.json");

// --- Logic to save a new subscriber's phone number ---
export async function saveSubscriber(phoneNumber: string, area: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(fileData);
    
    // Avoid duplicate entries
    const existing = db.subscribers.find((sub: any) => sub.phoneNumber === phoneNumber);
    if (!existing) {
      db.subscribers.push({ phoneNumber, area });
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
      console.log(`Subscriber saved: ${phoneNumber} for area: ${area}`);
    }
  } catch (error) {
    console.error("Error saving subscriber:", error);
  }
}

// --- Logic to send targeted SMS messages ---
export async function sendTargetedSms(area: string, messageBody: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(fileData);

    const targetSubscribers = db.subscribers.filter(
      (sub: any) => sub.area === area
    );

    console.log(`Found ${targetSubscribers.length} SMS subscribers for area: ${area}`);

    const promises = targetSubscribers.map((sub: any) => {
      return client.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: sub.phoneNumber, // The citizen's actual phone number
      });
    });

    await Promise.all(promises);
    console.log("SMS messages sent successfully via Twilio.");
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}