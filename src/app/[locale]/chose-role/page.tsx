"use client";
import { Routes, Pages } from '@/lib/types/enums';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Renders a card-based role selection UI for the authenticated user.
 * User gets their roles from the NextAuth session.
 * Selecting a role navigates to its dashboard.
 */
export default function ChooseRolePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingRoleId, setLoadingRoleId] = useState<string | null>(null);

  const roles =
    session?.user?.roles && Array.isArray(session.user.roles)
      ? session.user.roles
      : [];

  const dashboardMap: Record<string, string> = {
    ADMIN: `/${Routes.DASHBOARDS}/${Pages.ADMIN}`,
    ORGANIZATIONOWNER: `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`,
    EMPLOYEE: `/${Routes.DASHBOARDS}/${Pages.EMPLOYEE}`,
    ENRICHER: `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`,
  };

  const handleSelectRole = (roleName: string, roleId: string) => {
    setLoadingRoleId(roleId);
    const href = dashboardMap[roleName] || "/dashboard";
    router.push(href);
  };

  return (
    <main className="min-h-dvh flex items-center justify-center bg-gradient-to-tr from-fuchsia-100 via-blue-50 to-indigo-50">
      <div className="w-full max-w-xl px-4 py-10">
        <Card className="border-blue-100 shadow-lg rounded-2xl bg-white/90">
          <CardHeader>
            <CardTitle className="mb-2 text-center text-2xl font-bold text-indigo-700 flex flex-col items-center">
              <UserCheck className="mb-2 text-fuchsia-600" size={36} />
              Choose a Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="mb-2 text-center text-muted-foreground text-sm">
              Please select which role you want to use for this session:
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {roles.length === 0 && (
                <div className="col-span-2 text-center text-gray-400">
                  No roles found for your account.
                </div>
              )}
              {roles.map((role: { id: string; name: string }) => (
                <Button
                  key={role.id}
                  variant="secondary"
                  className={`h-14 rounded-xl w-full justify-center text-lg font-semibold flex items-center gap-2 border-2 transition-all duration-150 ${
                    loadingRoleId === role.id
                      ? "pointer-events-none opacity-70"
                      : "hover:border-indigo-400 border-transparent"
                  }`}
                  onClick={() => handleSelectRole(role.name, role.id)}
                  disabled={loadingRoleId !== null}
                >
                  {loadingRoleId === role.id ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    role.name
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}



