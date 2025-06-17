// src/lib/sms.ts
import twilio from "twilio";
import fs from "fs/promises";
import path from "path";

// ... (your twilio client setup remains the same)
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const dbPath = path.join(process.cwd(), "db.json");

// --- Logic to save a new subscriber with BOTH location and region ---
export async function saveSubscriber(phoneNumber: string, location: string, region: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(fileData);
    
    const existing = db.subscribers.find((sub: any) => sub.phoneNumber === phoneNumber);
    if (!existing) {
      db.subscribers.push({ phoneNumber, location, region });
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
      console.log(`Subscriber saved: ${phoneNumber} for location: ${location}, region: ${region}`);
    }
  } catch (error) {
    console.error("Error saving subscriber:", error);
  }
}

// --- NEW: Logic to send alerts based on SPECIFIC DENGUE LOCATION ---
export async function sendDengueAlert(location: string, messageBody: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(fileData);

    // Exact match for the specific dengue cluster location
    const targetSubscribers = db.subscribers.filter(
      (sub: any) => sub.location === location
    );

    console.log(`Found ${targetSubscribers.length} subscribers for DENGUE location: ${location}`);
    
    const promises = targetSubscribers.map((sub: any) => 
      client.messages.create({ body: messageBody, from: twilioPhoneNumber, to: sub.phoneNumber })
    );
    await Promise.all(promises);
  } catch (error) {
    console.error("Error sending dengue SMS:", error);
  }
}

// --- NEW: Logic to send alerts based on BROAD PSI REGION ---
export async function sendPsiAlert(region: string, messageBody: string) {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(fileData);

    // Match for the general region (north, south, etc.)
    const targetSubscribers = db.subscribers.filter(
      (sub: any) => sub.region.toLowerCase() === region.toLowerCase()
    );

    console.log(`Found ${targetSubscribers.length} subscribers for PSI region: ${region}`);

    const promises = targetSubscribers.map((sub: any) => 
      client.messages.create({ body: messageBody, from: twilioPhoneNumber, to: sub.phoneNumber })
    );
    await Promise.all(promises);
  } catch (error) {
    console.error("Error sending PSI SMS:", error);
  }
}