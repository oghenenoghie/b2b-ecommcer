"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

// The signature element: a single calm, full-width command input that runs
// hybrid semantic search and hands off to the AI procurement assistant.
export function ProcurementBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full items-stretch border border-ink">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe what you need to source…"
        className="w-full bg-paper px-5 py-4 font-display text-lg italic text-ink placeholder:text-ash focus:outline-none md:px-6 md:py-5 md:text-xl"
      />
      <Button type="submit" variant="primary" className="rounded-none border-0 border-l border-ink px-6">
        Search
      </Button>
    </form>
  );
}
