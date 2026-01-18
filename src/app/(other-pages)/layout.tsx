import AppHeader from "@/layouts/AppHeader";
import Footer from "@/layouts/Footer";

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