import AppSidebar from "@/layouts/AppSidebar";

export default function OtherPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AppSidebar />
            <main>
                {children}
            </main>
        </>
    );
}