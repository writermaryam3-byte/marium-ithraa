import { getSession, signIn } from "next-auth/react";

type RoleLike = string | null | undefined;

function normalizeRole(role: RoleLike) {
  return (role ?? "").toString().trim().toUpperCase();
}

export async function signInWithPhoneAndRedirect({
  phone,
  password,
  push,
}: {
  phone: string;
  password: string;
  push: (href: string) => void;
}) {
  const result = await signIn("credentials", {
    phone,
    password,
    redirect: false,
  });
  console.log("res: ", result)

  if (!result?.ok) {
    return { ok: false as const, error: result?.error ?? "INVALID_CREDENTIALS" };
  }

  const session = await getSession();
  const role = normalizeRole(session?.user?.role as unknown as RoleLike);

  const dashboardMap: Record<string, string> = {
    ADMIN: "/dashboard/admin",
    ORGANIZATION: "/dashboard/org",
    EMPLOYEE: "/dashboard/employee",
  };

  push(dashboardMap[role] || "/dashboard");
  return { ok: true as const };
}

