import { ComingSoonGate } from "@/components/gate/ComingSoonGate";
import { getViewer } from "@/lib/auth/dal";
import { gateStateFor } from "@/lib/auth/viewer";
import { signInNoticeFor } from "@/lib/auth/sign-in-notice";

/**
 * The landing page (the gate).
 *
 * The proxy rewrites `/` to the main site for an admitted user, so in the
 * normal pre-launch flow this page renders the signed-out state. It still
 * resolves the viewer itself rather than assuming the proxy ran — the proxy
 * is an optimistic check, not the authorisation boundary.
 *
 * `?auth_error=` is set by /auth/callback when a sign-in is refused or fails.
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [viewer, params] = await Promise.all([getViewer(), searchParams]);

  return <ComingSoonGate authState={gateStateFor(viewer)} notice={signInNoticeFor(params.auth_error)} />;
}
