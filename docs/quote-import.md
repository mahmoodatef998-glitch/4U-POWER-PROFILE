# Quotation import (PDF → new quotation)

Admin → Quotations → **New quotation** → "Start from a ready quotation (PDF)". No AI; two paths, in order:

1. **Embedded data (exact).** The PDF info dictionary carries JSON under the key `/FourUQuote`
   (or Keywords `4U-QUOTE:<base64 JSON>`). PDFs downloaded from the admin carry it automatically
   (`src/lib/quote-pdf.ts`). Quotation PDFs prepared outside the admin (e.g. by Claude) should embed it too.
2. **Text table (best effort).** Otherwise the text is read from the PDF (`src/lib/quote-import.ts`): labelled
   customer fields, the item table (Description / Qty / Unit / Unit price / Total), subtotal, discount, VAT,
   grand total. Mismatches (qty × price ≠ total, totals off) are shown as warnings. Scanned PDFs can't be read.

Always review the imported lines, then **Save**. Prices are converted to AED at today's rate when the PDF is
in another currency.

## Embedded JSON (v1)

```json
{
  "v": 1,
  "customer": { "name": "", "attention": "", "contact": "", "email": "", "project": "", "ref": "", "trn": "", "address": "" },
  "items": [{ "code": "4U-P100", "title": "", "description": "", "qty": 1, "unit": "Units", "unit_price": 0 }],
  "currency": "AED",
  "vat_rate": 5,
  "discount_pct": 0,
  "quote_date": "2026-11-09",
  "validity": "",
  "delivery": "",
  "notes": "",
  "total": 0
}
```

`unit_price` is in `currency`; `total` is the printed grand total (used only as a check). Embed with pdf-lib:
`doc.getInfoDict().set(PDFName.of("FourUQuote"), PDFHexString.fromText(JSON.stringify(data)))`.
