// src/lib/sms.ts
import twilio from "twilio";
import fs from "fs/promises";
import path from "path";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const dbPath = path.join(process.cwd(), "db.json");

interface Subscriber {
  phoneNumber: string;
  location: string;
  region: string;
}

interface Database {
  subscribers: Subscriber[];
}

export async function saveSubscriber(
  phoneNumber: string,
  location: string,
  region: string,
) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db: Database = JSON.parse(fileData);

    const existing = db.subscribers.find(
      (sub: Subscriber) => sub.phoneNumber === phoneNumber,
    );
    if (!existing) {
      db.subscribers.push({ phoneNumber, location, region });
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
      console.log(
        `Subscriber saved: ${phoneNumber} for location: ${location}, region: ${region}`,
      );
    }
  } catch (error) {
    console.error("Error saving subscriber:", error);
  }
}

export async function sendDengueAlert(location: string, messageBody: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db: Database = JSON.parse(fileData);

    const targetSubscribers = db.subscribers.filter(
      (sub: Subscriber) => sub.location === location,
    );

    console.log(
      `Found ${targetSubscribers.length} subscribers for DENGUE location: ${location}`,
    );

    const promises = targetSubscribers.map((sub: Subscriber) =>
      client.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: sub.phoneNumber,
      }),
    );
    await Promise.all(promises);
  } catch (error) {
    console.error("Error sending dengue SMS:", error);
  }
}

export async function sendPsiAlert(region: string, messageBody: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db: Database = JSON.parse(fileData);

    const targetSubscribers = db.subscribers.filter(
      (sub: Subscriber) => sub.region.toLowerCase() === region.toLowerCase(),
    );

    console.log(
      `Found ${targetSubscribers.length} subscribers for PSI region: ${region}`,
    );

    const promises = targetSubscribers.map((sub: Subscriber) =>
      client.messages.create({
        body: messageBody,
        from: twilioPhoneNumber,
        to: sub.phoneNumber,
      }),
    );
    await Promise.all(promises);
  } catch (error) {
    console.error("Error sending PSI SMS:", error);
  }
}