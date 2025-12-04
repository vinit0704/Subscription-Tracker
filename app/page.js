// app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="hero">
      <h2>Track your subscriptions, anonymously.</h2>
      <p>
        No signup, no password, no email. Just open the site once, and we’ll
        keep your subscriptions for this browser in our database.
      </p>
      <Link href="/dashboard" className="primary-btn">
        Go to Dashboard
      </Link>
    </section>
  );
}
