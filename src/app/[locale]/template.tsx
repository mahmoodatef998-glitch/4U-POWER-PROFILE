/** Re-mounts on every navigation: a short fade makes page changes feel continuous without slowing them down. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
