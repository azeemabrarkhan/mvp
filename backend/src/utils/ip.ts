export function normalizeIp(ip: string) {
  if (ip === "::1") return "127.0.0.1";
  if (ip.startsWith("::ffff:")) return ip.split("::ffff:")[1];
  return ip;
}
