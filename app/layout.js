// app/layout.js
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import Link from "next/link";

export const metadata = {
  title: "SubTracker ",
  description: "Track all your subscription analytics anonymously.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <header className="site-header">
            <div className="container header-inner">
              <Link href="/">
                <h1 className="logo">SubTracker</h1>
              </Link>
              <nav>
                <Link href="/dashboard">Dashboard</Link>
              </nav>
            </div>
          </header>

          <main className="container">{children}</main>

          <footer className="site-footer">
            <div className="container">
              <p>© {new Date().getFullYear()} SubTracker. Anonymous lifetime login.</p>
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
