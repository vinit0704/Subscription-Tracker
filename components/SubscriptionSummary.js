"use client";

import { useUserData } from "@/context/UserContext";
import { calculateSubscriptionMetrics } from "@/utils/subscriptions";

export default function SubscriptionSummary() {
  const { subscriptions } = useUserData();

  const metrics = calculateSubscriptionMetrics(subscriptions);
  const {
    monthlyTotal,
    yearlyTotal,
    activeCount,
    nextRenewalDate,
    nextRenewalAmount,
    nextRenewalCurrency,
  } = metrics;

  return (
    <div className="card">
      <h2>Overview</h2>
      <div className="summary-grid">
        <div>
          <h3>Active subscriptions</h3>
          <p>{activeCount}</p>
        </div>

        <div>
          <h3>Monthly total</h3>
          <p>{monthlyTotal.toFixed(2)}</p>
        </div>

        <div>
          <h3>Yearly total</h3>
          <p>{yearlyTotal.toFixed(2)}</p>
        </div>

        <div>
          <h3>Next renewal</h3>
          {nextRenewalDate ? (
            <p>
              {nextRenewalDate.toDateString()} – {nextRenewalCurrency}{" "}
              {nextRenewalAmount.toFixed(2)}
            </p>
          ) : (
            <p>No upcoming</p>
          )}
        </div>
      </div>
    </div>
  );
}
