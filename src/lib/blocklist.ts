/**
 * IPs always blocked from the whole site, even if Supabase is unreachable. Bans added automatically (more than
 * 5 wrong admin passwords) live in Supabase `blocked_ips`.
 * 50.7.250.107 (FDCservers, Hong Kong): 5 Nov 2026 probed the forms, created quotation 1059 through the admin
 * bypass, then tried to guess the admin password.
 */
// 4.190.153.197 (Microsoft Azure, Osaka): 79 wrong admin passwords on the night of 5–6 Nov 2026.
export const BLOCKED_IPS = new Set<string>(["50.7.250.107", "4.190.153.197"]);

export const isBlockedIp = (ip: string | null | undefined) => !!ip && BLOCKED_IPS.has(ip.trim());
