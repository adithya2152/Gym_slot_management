import ResponsiveAppBar from "@/components/memnav";

export default function Adminlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ResponsiveAppBar />
      {children}
    </div>
  );
}
    