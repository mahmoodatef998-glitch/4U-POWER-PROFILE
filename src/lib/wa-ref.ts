/** WhatsApp reference codes: "4U-" + 5 chars from an alphabet without look-alikes (0/O, 1/I/L). */
export const WA_REF_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const WA_REF_RE = /^4U-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/;

export function newWaRef() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return "4U-" + Array.from(bytes, (b) => WA_REF_ALPHABET[b % WA_REF_ALPHABET.length]).join("");
}
