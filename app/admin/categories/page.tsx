import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function Page() {
  return (
    <div>
      <p className="label mb-2">Categories</p>
      <h1 className="font-display text-display-lg text-ink">Categories</h1>
      <p className="mt-4 text-sm text-smoke">Category tree management lands in Build order step 3.</p>
    </div>
  );
}
