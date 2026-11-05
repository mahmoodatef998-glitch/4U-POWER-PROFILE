/**
 * IPs blocked from the whole site (pages, admin and form APIs).
 * 50.7.250.107 (FDCservers, Hong Kong): 5 Nov 2026 probed the forms, created quotation 1059 through the admin
 * bypass, then tried to guess the admin password.
 */
export const BLOCKED_IPS = new Set<string>(["50.7.250.107"]);

export const isBlockedIp = (ip: string | null | undefined) => !!ip && BLOCKED_IPS.has(ip.trim());
