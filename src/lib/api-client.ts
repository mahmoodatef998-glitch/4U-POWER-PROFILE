import type { CalcLog } from "@/app/actions/calculator";
import type { LeadState } from "@/app/actions/leads";
import type { PartsState } from "@/app/actions/parts";

/**
 * Browser-side calls to the form endpoints. Plain fetch to fixed /api routes (instead of Server
 * Actions, whose ids change on every deployment) so forms keep working on pages opened before a deploy.
 */
async function post<T>(url: string, body: FormData | object, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      method: "POST",
      ...(body instanceof FormData ? { body } : { body: JSON.stringify(body), headers: { "content-type": "application/json" } }),
    });
    if (!res.ok && res.status !== 400) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const submitLeadForm = (_prev: LeadState, form: FormData) => post<LeadState>("/api/lead", form, { status: "error" });
export const submitPartsForm = (form: FormData) => post<PartsState>("/api/parts", form, { status: "error" });
export const logCalculationRun = (input: CalcLog) => post<{ id: string | null }>("/api/calc", input, { id: null });
