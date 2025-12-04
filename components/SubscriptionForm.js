"use client";

import { useState } from "react";
import { useUserData } from "@/context/UserContext";

const blankSubscription = {
  name: "",
  category: "Web Services",
  cost: "",
  currency: "USD",
  billingFrequency: "Monthly",
  paymentMethod: "Credit Card",
  startDate: "",
  renewalType: "Automatic",
  notes: "",
  status: "Active",
};

export default function SubscriptionForm({ onClose }) {
  const [formData, setFormData] = useState(blankSubscription);
  const [saving, setSaving] = useState(false);
  const { addSubscription } = useUserData();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const normalized = {
        ...formData,
        cost: Number(formData.cost) || 0,
      };
      await addSubscription(normalized);
      setFormData(blankSubscription);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setFormData(blankSubscription);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Add Subscription</h2>

      <div className="grid">
        <label>
          Name
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </label>

        <label>
          Cost
          <input
            name="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Currency
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          >
            <option>USD</option>
            <option>INR</option>
            <option>EUR</option>
          </select>
        </label>

        <label>
          Billing Frequency
          <select
            name="billingFrequency"
            value={formData.billingFrequency}
            onChange={handleChange}
          >
            <option>Monthly</option>
            <option>Yearly</option>
            <option>Quarterly</option>
            <option>One-time</option>
          </select>
        </label>

        <label>
          Payment Method
          <input
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          />
        </label>

        <label>
          Start Date
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
        </label>

        <label>
          Renewal Type
          <select
            name="renewalType"
            value={formData.renewalType}
            onChange={handleChange}
          >
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </label>

        <label>
          Status
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Active</option>
            <option>Paused</option>
            <option>Cancelled</option>
          </select>
        </label>
      </div>

      <label>
        Notes
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
        />
      </label>

      <div className="actions">
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
