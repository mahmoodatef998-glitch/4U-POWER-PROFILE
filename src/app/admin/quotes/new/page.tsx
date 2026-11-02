import Link from "next/link";
import { DEFAULT_VALIDITY, EMPTY_CUSTOMER, VAT_RATE } from "@/lib/quote";
import { lastSales, leadCustomer } from "@/lib/quote-data";
import { fxRates } from "@/lib/fx";
import { loadPriceBook } from "@/lib/price-book-data";
import { QuoteEditor } from "../quote-editor";

export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead } = await searchParams;
  const fx = await fxRates();
  const [sales, fromLead, prices] = await Promise.all([lastSales(), lead ? leadCustomer(lead) : null, loadPriceBook(fx)]);
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
          delivery: "",
          notes: "",
          price_list: "uae",
          country: "AE",
          uplift_pct: 0,
          currency: "AED",
          fx_rate: 1,
          fx_at: null,
          discount_pct: 0,
          vat_rate: VAT_RATE,
          items: [],
        }}
        initialSearch={fromLead?.kva ? String(fromLead.kva) : ""}
        prices={prices}
        fx={fx}
      />
    </div>
  );
}
