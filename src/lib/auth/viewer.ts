import type { GateAuthState } from "@/components/gate/ComingSoonGate";
import { isAdmitted } from "./access";
import type { AppRole } from "@/lib/supabase/types";

export interface Viewer {
  /** Verified via `auth.getUser()`, never from an unverified cookie. */
  email: string | null;
  /** `profiles.role`. null = signed in but NOT admitted (Part A3). */
  role: AppRole | null;
  hasSession: boolean;
}

export const ANONYMOUS_VIEWER: Viewer = { email: null, role: null, hasSession: false };

/** Viewer -> the three <ComingSoonGate/> states from the README component map. */
export function gateStateFor(viewer: Viewer): GateAuthState {
  if (!viewer.hasSession) {
    return { status: "signed-out" };
  }
  if (isAdmitted(viewer.role)) {
    return { status: "signed-in-admitted", email: viewer.email ?? "" };
  }
  return { status: "signed-in-not-admitted", email: viewer.email ?? "" };
}
