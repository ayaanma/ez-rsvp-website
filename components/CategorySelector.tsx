"use client";

import { useState } from "react";
import { categories } from "@/lib/mock-data";

export function CategorySelector() {
  const [selected, setSelected] = useState<string[]>(["Music", "Food / dining"]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {categories.map((category) => {
        const active = selected.includes(category);
        return (
          <button
            type="button"
            key={category}
            onClick={() => setSelected((old) => active ? old.filter((item) => item !== category) : [...old, category])}
            className={`cursor-pointer rounded-2xl border px-3 py-3 text-left text-sm font-black transition-colors ${
              active
                ? "border-[#b000b8]/25 bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50 text-[#11081f]"
                : "border-black/[0.08] bg-white text-[#11081f]/58 hover:text-[#11081f]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
