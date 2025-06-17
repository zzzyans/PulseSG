// src/components/NotificationSubscriber.tsx
"use client";

import React, { useState } from "react";

export default function NotificationSubscriber() {
  const [status, setStatus] = useState("Idle");
  const [phoneNumber, setPhoneNumber] = useState(""); // State for the phone number input

  const handleSubscribe = async () => {
    if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
      setStatus("Please enter a valid phone number with country code (e.g., +6512345678).");
      return;
    }
  
    setStatus("Subscribing...");
    try {
      const location = "Woodgrove View / Woodlands Ave 1 (Blk 307, 308, 340, 341) / Woodlands St 31 (Blk 304, 310, 311, 312, 313, 314, 316, 317, 318, 319) / Woodlands St 32 (Blk 320, 322, 323, 326, 329, 344, 345, 346) / Woodlands St 41 (Blk 402, 408, 418, 419, 420)";
      const region = "north"; 
  
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, location, region }),
      });
  
      setStatus(`Subscribed ${phoneNumber} for region: ${region}!`);
    } catch (error) {
      setStatus("Subscription failed.");
      console.error("Failed to subscribe:", error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-slate-200 w-80">
      <p className="text-sm font-bold mb-2">SMS Alert Test Panel</p>
      <p className="text-xs text-slate-500 mb-2">Enter a phone number to simulate a citizen subscribing.</p>
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+6512345678"
        className="w-full p-2 border border-slate-300 rounded-md text-sm"
      />
      <button
        onClick={handleSubscribe}
        className="w-full mt-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
      >
        Subscribe Phone Number
      </button>
      <p className="text-xs text-slate-500 mt-2">Status: {status}</p>
    </div>
  );
}