import Link from "next/link";
import { DEFAULT_VALIDITY, EMPTY_CUSTOMER } from "@/lib/quote";
import { lastSales, leadCustomer } from "@/lib/quote-data";
import { QuoteEditor } from "../quote-editor";

export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead } = await searchParams;
  const [sales, fromLead] = await Promise.all([lastSales(), lead ? leadCustomer(lead) : null]);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dubai" });
  return (
    <div className="grid gap-6">
      <div>
        <Link href="/admin/quotes" className="text-sm font-semibold text-muted hover:text-ink">← Quotations</Link>
        <h1 className="mt-1 text-2xl font-extrabold">New quotation</h1>
        {fromLead && <p className="mt-1 text-sm text-muted">Customer details taken from the website lead{fromLead.kva ? ` (asked for ${fromLead.kva} kVA)` : ""}.</p>}
      </div>
      <QuoteEditor
        initial={{
          id: null,
          lead_id: fromLead ? lead! : null,
          quote_date: today,
          status: "draft",
          customer: fromLead?.customer ?? EMPTY_CUSTOMER,
          sales,
          validity: DEFAULT_VALIDITY,
          notes: "",
          items: [],
        }}
        initialSearch={fromLead?.kva ? String(fromLead.kva) : ""}
      />
    </div>
  );
}
