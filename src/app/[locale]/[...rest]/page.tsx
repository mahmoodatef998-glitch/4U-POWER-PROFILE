import { notFound } from "next/navigation";

// Unknown paths inside a locale render the localized 404 with a real 404 status (no soft-404s).
export default function CatchAll() {
  notFound();
}
