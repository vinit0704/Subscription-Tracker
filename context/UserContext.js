// context/UserContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function useUserData() {
  return useContext(UserContext);
}

// helper: parse JSON or show raw HTML error
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error("Server did not return JSON. Raw response:", text);
    throw new Error("Server did not return valid JSON");
  }
}

export function UserProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // init: get/create user and load subs
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        setLoading(true);

        const res = await fetch("/api/init");
        const data = await safeJson(res);

        if (!res.ok) {
          console.error("Init failed:", data);
          if (!cancelled) setLoading(false);
          return;
        }

        const subs = data.subscriptions || [];
        if (!cancelled) setSubscriptions(subs);
      } catch (err) {
        console.error("Init error:", err);
        if (!cancelled) setLoading(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveSubscriptionsToServer(newSubscriptions) {
    const res = await fetch("/api/subscriptions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptions: newSubscriptions }),
    });

    const data = await safeJson(res);

    if (!res.ok) {
      console.error("Save failed:", data);
      throw new Error(data.message || "Failed to save subscriptions");
    }

    return data.subscriptions || [];
  }

  async function addSubscription(subscription) {
    const newSubs = [...subscriptions, subscription];

    try {
      const saved = await saveSubscriptionsToServer(newSubs);
      setSubscriptions(saved); // only trust DB
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save subscription to server. Check console.");
    }
  }

  async function deleteSubscription(index) {
    const newSubs = subscriptions.filter((_sub, i) => i !== index);

    try {
      const saved = await saveSubscriptionsToServer(newSubs);
      setSubscriptions(saved); // only trust DB
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to delete subscription on server. Check console.");
    }
  }

  const value = {
    subscriptions,
    loading,
    addSubscription,
    deleteSubscription,
  };

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}
