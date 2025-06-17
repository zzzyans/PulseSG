// scripts/seed.mjs
import { createClient } from "redis"; 
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function seedDatabase() {
  console.log("Starting to seed database...");

  const subscribers = [
    {
      phoneNumber: "+6591111338",
      location:
        "Woodgrove View / Woodlands Ave 1 (Blk 307, 308, 340, 341) / Woodlands St 31 (Blk 304, 310, 311, 312, 313, 314, 316, 317, 318, 319) / Woodlands St 32 (Blk 320, 322, 323, 326, 329, 344, 345, 346) / Woodlands St 41 (Blk 402, 408, 418, 419, 420)",
      region: "north",
    },
    {
      phoneNumber: "+6581776696",
      location:
        "Lor 4, 8, 10, 12, 17 Geylang / Lor 14 Geylang (Central Imperial)",
      region: "central",
    },
  ];

  const SUBSCRIBERS_KEY = "subscribers";

  try {
    await redisClient.connect(); 
    await redisClient.set(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
    console.log(`Successfully seeded ${subscribers.length} subscribers.`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await redisClient.disconnect(); 
    console.log("Database seeding complete!");
  }
}

seedDatabase();