import { ComingSoonGate } from "@/components/gate/ComingSoonGate";
import { getViewer } from "@/lib/auth/dal";
import { gateStateFor } from "@/lib/auth/viewer";
import { workspaceUrl } from "@/lib/supabase/env";

/**
 * The private-preview gate.
 *
 * The proxy rewrites `/` to the main site for an admitted user, so in the
 * normal pre-launch flow this page renders the signed-out or invite-only
 * state. It still resolves the viewer itself rather than assuming the proxy
 * ran — the proxy is an optimistic check, not the authorisation boundary.
 */
export default async function HomePage() {
  const viewer = await getViewer();

  return <ComingSoonGate authState={gateStateFor(viewer)} workspaceHref={workspaceUrl()} />;
}
