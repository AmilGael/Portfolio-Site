"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export default function Prompt() {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = `mailto:gamaleguista@gmail.com?subject=${encodeURIComponent(
      "From the archive",
    )}&body=${encodeURIComponent(value)}`;
  };

  return (
    <form onSubmit={submit} className="mt-10">
      <label htmlFor="line" className="caps text-[12px] text-muted">
        &gt; mail gamaleguista@gmail.com
      </label>
      <div className="mt-3 flex items-baseline gap-3 border-b border-rule pb-2 focus-within:border-signal">
        <span aria-hidden className="text-signal">
          &gt;
        </span>
        <input
          id="line"
          name="line"
          type="text"
          autoComplete="off"
          placeholder="Open a line. Type, then Enter."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-w-0 flex-1 bg-transparent text-[15.5px] text-text placeholder:text-muted focus:outline-none"
        />
        {value.length === 0 && !focused && (
          <span aria-hidden className="prompt-caret text-signal">
            _
          </span>
        )}
      </div>
      <button type="submit" className="signal-link mt-5 text-[13px] caps">
        Open a line
      </button>
      <p className="mt-3 text-[12px] text-muted">
        Hiring, or a product that needs building. Either one.
      </p>
    </form>
  );
}
