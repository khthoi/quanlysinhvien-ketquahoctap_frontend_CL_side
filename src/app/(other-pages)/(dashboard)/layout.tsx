import AppSidebar from "@/layouts/AppSidebar";

export default function OtherPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AppSidebar />
            <main className="pt-8 bg-white dark:bg-white">
                <div className="pt-8"></div>
                <div className="pt-8"></div>
                <div className="pt-5"></div>
                {children}
            </main>
        </>
    );
}
