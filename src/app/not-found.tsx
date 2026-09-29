import Link from "next/link";
import "./globals.css";

// Fallback for URLs outside any locale segment.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-navy-950 p-6 text-center text-white">
        <div>
          <p className="text-6xl font-extrabold text-amber-400">404</p>
          <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
          <Link href="/en" className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 font-bold text-navy-950">
            Go to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
