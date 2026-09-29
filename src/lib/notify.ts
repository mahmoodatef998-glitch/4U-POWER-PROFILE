import "server-only";

/** Optional lead e-mail via Resend. No-ops unless RESEND_API_KEY and LEAD_NOTIFY_EMAIL are set. */
export async function notifyLead(lead: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return;
  const from = process.env.LEAD_FROM_EMAIL || "leads@4ugenerators.com";
  const rows = Object.entries(lead)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#475569">${k}</td><td style="padding:4px 0"><b>${String(v).replace(/</g, "&lt;")}</b></td></tr>`)
    .join("");
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `4U Website <${from}>`,
        to: [to],
        subject: `New lead: ${lead.name ?? ""} ${lead.calculated_kva ? `(${lead.calculated_kva} kVA)` : ""}`.trim(),
        html: `<h2>New website lead</h2><table>${rows}</table>`,
      }),
    });
  } catch (e) {
    console.error("[notify] resend failed", e);
  }
}
