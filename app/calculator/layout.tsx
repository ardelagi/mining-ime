export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="w-full py-4">{children}</section>;
}
