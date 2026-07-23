/**
 * Sign out via a real form POST — no client JS, and not triggerable by a
 * cross-site image tag or a link prefetcher the way a GET would be.
 */
export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className={
          className ??
          "min-h-11 text-[14px] font-medium text-white/72 underline decoration-concrete underline-offset-4 transition-colors duration-200 hover:text-white"
        }
      >
        Sign out
      </button>
    </form>
  );
}
