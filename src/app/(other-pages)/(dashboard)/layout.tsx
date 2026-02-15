'use client';

import AppSidebar from "@/layouts/AppSidebar";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    
    return (
        <>
            <AppSidebar />
            <main className={`transition-all duration-300 pt-16 md:pt-20 min-h-screen bg-white dark:bg-white ${
                isCollapsed ? 'ml-20' : 'ml-72'
            }`}>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </>
    );
}

export default function OtherPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardContent>
                {children}
            </DashboardContent>
        </SidebarProvider>
    );
}
