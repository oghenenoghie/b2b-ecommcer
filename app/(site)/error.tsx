"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="px-6 py-24 text-center">
      <p className="label mb-2">Something went wrong</p>
      <button onClick={reset} className="text-sm text-ink underline underline-offset-4">
        Try again
      </button>
    </div>
  );
}
