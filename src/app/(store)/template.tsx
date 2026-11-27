/** Re-mounts on every navigation, giving each page a short, calm entrance. */
export default function StoreTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
