import AppHeader from "@/layouts/AppHeader";

export default function OtherPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main>
        {children}
      </main>
    </>
  );
}