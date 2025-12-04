"use client";

import { useUserData } from "@/context/UserContext";

export default function SubscriptionsDisplay({ onEdit }) {
  const { subscriptions, deleteSubscription } = useUserData();

  if (!subscriptions.length) {
    return <p>No subscriptions yet. Add your first one!</p>;
  }

  return (
    <div className="card">
      <h2>Your Subscriptions</h2>
      <table className="subs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost</th>
            <th>Frequency</th>
            <th>Start</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub, index) => (
            <tr key={index}>
              <td>{sub.name}</td>
              <td>
                {sub.currency} {Number(sub.cost).toFixed(2)}
              </td>
              <td>{sub.billingFrequency}</td>
              <td>{sub.startDate || "-"}</td>
              <td>{sub.status}</td>
              <td>
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(index)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteSubscription(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
