import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { UserRoleProvider } from "@/contexts/user-role-context";

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserRoleProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </UserRoleProvider>
    );
}
