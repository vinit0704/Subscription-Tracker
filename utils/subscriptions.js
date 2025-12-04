// utils/subscriptions.js

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function calculateSubscriptionMetrics(subscriptions) {
  const today = new Date();
  let monthlyTotal = 0;
  let yearlyTotal = 0;
  let activeCount = 0;

  let nextRenewalDate = null;
  let nextRenewalAmount = 0;
  let nextRenewalCurrency = "";

  subscriptions.forEach((sub) => {
    if (sub.status !== "Active") return;

    activeCount += 1;

    const cost = Number(sub.cost) || 0;
    const freq = sub.billingFrequency || "Monthly";

    if (freq === "Monthly") {
      monthlyTotal += cost;
      yearlyTotal += cost * 12;
    } else if (freq === "Yearly") {
      yearlyTotal += cost;
      monthlyTotal += cost / 12;
    } else if (freq === "Quarterly") {
      yearlyTotal += cost * 4;
      monthlyTotal += (cost * 4) / 12;
    } else if (freq === "One-time") {
      // one-time doesn't count toward recurring monthly/yearly totals
    }

    // compute next renewal estimate
    const start = parseDate(sub.startDate);
    if (!start) return;

    let next = null;

    if (freq === "Monthly") {
      next = new Date(start);
      while (next <= today) {
        next = addMonths(next, 1);
      }
    } else if (freq === "Yearly") {
      next = new Date(start);
      while (next <= today) {
        next = addYears(next, 1);
      }
    } else if (freq === "Quarterly") {
      next = new Date(start);
      while (next <= today) {
        next = addMonths(next, 3);
      }
    } else if (freq === "One-time") {
      if (start > today) next = start;
    }

    if (!next) return;

    if (!nextRenewalDate || next < nextRenewalDate) {
      nextRenewalDate = next;
      nextRenewalAmount = cost;
      nextRenewalCurrency = sub.currency || "USD";
    }
  });

  return {
    monthlyTotal,
    yearlyTotal,
    activeCount,
    nextRenewalDate,
    nextRenewalAmount,
    nextRenewalCurrency,
  };
}
