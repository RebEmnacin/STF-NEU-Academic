import { createContext, useContext, useState, type ReactNode } from "react";

export type Role = "guest" | "student" | "leader" | "admin" | "superadmin";
export type View = string;

interface Ctx {
  role: Role;
  setRole: (r: Role) => void;
  view: View;
  setView: (v: View) => void;
  drawerDay: string | null;
  setDrawerDay: (d: string | null) => void;
  modal: string | null;
  setModal: (m: string | null) => void;
}

const PortalCtx = createContext<Ctx | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [role, setRoleRaw] = useState<Role>("guest");
  const [view, setView] = useState<View>("home");
  const [drawerDay, setDrawerDay] = useState<string | null>(null);
  const [modal, setModal] = useState<string | null>(null);

  const setRole = (r: Role) => {
    setRoleRaw(r);
    setDrawerDay(null);
    setModal(null);
    if (r === "guest") setView("home");
    else setView("dashboard");
  };

  return (
    <PortalCtx.Provider value={{ role, setRole, view, setView, drawerDay, setDrawerDay, modal, setModal }}>
      {children}
    </PortalCtx.Provider>
  );
}

export const usePortal = () => {
  const c = useContext(PortalCtx);
  if (!c) throw new Error("usePortal outside provider");
  return c;
};
