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
  const dashboardMap: Record<string, string> = {
    [UserRole.ADMIN]: `/${Routes.DASHBOARDS}/${Pages.ADMIN}`,
    [UserRole.ORGANIZATIONOWNER]: `/${Routes.DASHBOARDS}/${Pages.ORGANIZATION}`,
    [UserRole.EMPLOYEE]: `/${Routes.DASHBOARDS}/${Pages.EMPLOYEE}`,
    [UserRole.ENRICHER]: `/${Routes.DASHBOARDS}/${Pages.ENRICHER}`,
  };
  const result = await signIn("credentials", {
    phone,
    password,
    redirect: false,
  });
  console.log("res: ", result, phone, password)
  console.log("phone", phone)
  console.log("password", password)

  if (!result?.ok) {
    return { ok: false as const, error: result?.error ?? "INVALID_CREDENTIALS" };
  }



  const session = await getSession();
  if (!session) return { ok: false as const };
  console.log(session.user.isEmailVerified)
  if(!session.user.isEmailVerified){
    push(`/${Routes.EMAILVERIFICATION}`)
    return { ok: true as const };
  }

  const roles = session?.user?.roles;

  if (roles?.length > 1) {
    push(`/${Routes.CHOSEROLE}`)
    return { ok: true as const };
  }

  push(dashboardMap[roles[0].name] || "/dashboard");
  return { ok: true as const };
}

