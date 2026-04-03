export default function CustomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full py-4">{children}</section>;
}
