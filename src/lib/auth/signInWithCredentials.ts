import { getSession, signIn } from "next-auth/react";
import { Pages, Routes, UserRole } from "../types/enums";


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
  const role = session?.user?.role;

  const dashboardMap: Record<string, string> = {
    [UserRole.ADMIN]: `/${Routes.DASHBOARDS}/${Pages.AdMIN}`,
    [UserRole.ORGANIZATIONOWNER]: `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`,
    [UserRole.EMPLOYEE]: `/${Routes.DASHBOARDS}/${Pages.EMPLOYEE}`,
  };

  push(dashboardMap[role||""] || "/dashboard");
  return { ok: true as const };
}

