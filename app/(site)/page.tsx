import type { Metadata } from "next";
import Link from "next/link";

import { ProcurementBar } from "@/components/common/ProcurementBar";
import { FadeIn } from "@/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Home",
};

const CATEGORIES = [
  { slug: "bearings", label: "Bearings & Power Transmission" },
  { slug: "fasteners", label: "Fasteners & Fixings" },
  { slug: "safety", label: "Safety & PPE" },
  { slug: "marine", label: "Marine & Offshore" },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-line bg-paper px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label mb-6">AI procurement</p>
          <h1 className="font-display text-display-xl italic leading-tight text-ink">
            Describe what you need to source.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body text-smoke">
            Aswaq turns plain language into a ranked search over real, in-stock
            industrial inventory — no dropdown maze.
          </p>
          <div className="mt-10">
            <ProcurementBar />
          </div>
        </div>
      </section>

      <section className="bg-bone px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="label mb-8">Browse by category</p>
          <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
            {CATEGORIES.map((category) => (
              <FadeIn key={category.slug}>
                <Link
                  href={`/c/${category.slug}`}
                  className="group flex aspect-[4/3] flex-col justify-end bg-paper p-6 transition-colors hover:bg-ink"
                >
                  <span className="font-display text-lg text-ink group-hover:text-paper">
                    {category.label}
                  </span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
