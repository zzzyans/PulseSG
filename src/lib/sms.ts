// src/lib/sms.ts
import { createClient } from "redis"; // Use the standard 'redis' package
import twilio from "twilio";

// --- Setup Clients ---
// Initialize the standard Redis client using your REDIS_URL.
// This is the correct way to connect to a standard Redis provider like Redis Cloud.
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// It's a best practice to log any potential connection errors.
redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Initialize the Twilio client as before.
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// --- Define the data structure for a subscriber ---
interface Subscriber {
  phoneNumber: string;
  location: string;
  region: string;
}

// This is the key we use to store our list of subscribers in Redis.
const SUBSCRIBERS_KEY = "subscribers";

/**
 * Saves a new subscriber to the Redis database.
 * It ensures the connection is open before use and closed after.
 */
export async function saveSubscriber(
  phoneNumber: string,
  location: string,
  region: string,
) {
  try {
    // Ensure the client is connected before making a command.
    if (!redisClient.isOpen) await redisClient.connect();

    // Get the current list of subscribers.
    const data = await redisClient.get(SUBSCRIBERS_KEY);
    const subscribers: Subscriber[] = data ? JSON.parse(data) : [];

    // Check if the subscriber already exists to avoid duplicates.
    const existing = subscribers.find((sub) => sub.phoneNumber === phoneNumber);
    if (!existing) {
      const newSubscribers = [
        ...subscribers,
        { phoneNumber, location, region },
      ];
      // Redis stores strings, so we must stringify our array before saving.
      await redisClient.set(SUBSCRIBERS_KEY, JSON.stringify(newSubscribers));
      console.log(`Subscriber saved: ${phoneNumber}`);
    }
  } catch (error) {
    console.error("Error saving subscriber:", error);
  } finally {
    // It's crucial to disconnect in a serverless environment to free up connections.
    if (redisClient.isOpen) await redisClient.disconnect();
  }
}

/**
 * Sends an SMS alert to all subscribers in a specific dengue cluster location.
 */
export async function sendDengueAlert(location: string, messageBody: string) {
  try {
    if (!redisClient.isOpen) await redisClient.connect();

    const data = await redisClient.get(SUBSCRIBERS_KEY);
    const subscribers: Subscriber[] = data ? JSON.parse(data) : [];

    // Filter for subscribers whose location is an exact match.
    const targetSubscribers = subscribers.filter(
      (sub) => sub.location === location,
    );

    console.log(
      `Found ${targetSubscribers.length} subscribers for DENGUE location: ${location}`,
    );

    if (targetSubscribers.length > 0) {
      const promises = targetSubscribers.map((sub) =>
        twilioClient.messages.create({
          body: messageBody,
          from: twilioPhoneNumber,
          to: sub.phoneNumber,
        }),
      );
      await Promise.all(promises);
    }
  } catch (error) {
    console.error("Error sending dengue SMS:", error);
  } finally {
    if (redisClient.isOpen) await redisClient.disconnect();
  }
}

/**
 * Sends an SMS alert to all subscribers in a broad PSI region (e.g., "north").
 */
export async function sendPsiAlert(region: string, messageBody: string) {
  try {
    if (!redisClient.isOpen) await redisClient.connect();

    const data = await redisClient.get(SUBSCRIBERS_KEY);
    const subscribers: Subscriber[] = data ? JSON.parse(data) : [];

    // Filter for subscribers whose region matches (case-insensitive).
    const targetSubscribers = subscribers.filter(
      (sub) => sub.region.toLowerCase() === region.toLowerCase(),
    );

    console.log(
      `Found ${targetSubscribers.length} subscribers for PSI region: ${region}`,
    );

    if (targetSubscribers.length > 0) {
      const promises = targetSubscribers.map((sub) =>
        twilioClient.messages.create({
          body: messageBody,
          from: twilioPhoneNumber,
          to: sub.phoneNumber,
        }),
      );
      await Promise.all(promises);
    }
  } catch (error)
  {
    console.error("Error sending PSI SMS:", error);
  } finally {
    if (redisClient.isOpen) await redisClient.disconnect();
  }
}