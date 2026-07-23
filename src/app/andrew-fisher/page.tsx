import { requireAdmitted } from "@/lib/auth/dal";

export default async function AndrewFisherPage() {
  // Gated with the rest of the site pre-launch. The page itself is deferred
  // (being finalised in Claude Design) and ships with the footer Resume link.
  await requireAdmitted();

  return null;
}
