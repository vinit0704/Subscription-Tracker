"use client";

import { useState } from "react";
import { useUserData } from "@/context/UserContext";
import SubscriptionSummary from "@/components/SubscriptionSummary";
import SubscriptionsDisplay from "@/components/SubscriptionDisplay";
import SubscriptionForm from "@/components/SubscriptionForm";

export default function DashboardPage() {
  const { subscriptions, loading } = useUserData();
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  if (loading) {
    return <p>Loading your data...</p>;
  }

  function handleAddNew() {
    setEditIndex(null);
    setShowForm(true);
  }

  // NOTE: For simplicity, we reuse SubscriptionForm as "add" only.
  // If you want true editing, you'd pass initial data + update logic.
  function handleEdit(index) {
    // Here we just open form again; you could extend this to actually edit.
    setEditIndex(index);
    setShowForm(true);
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>
        This browser is treated as your permanent account. We store your
        subscriptions in MongoDB using an anonymous ID.
      </p>

      <SubscriptionSummary />

      <div className="actions-top">
        <button onClick={handleAddNew}>Add Subscription</button>
      </div>

      <SubscriptionsDisplay onEdit={handleEdit} />

      {showForm && (
        <div className="modal">
          <div className="modal-inner">
            <SubscriptionForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
