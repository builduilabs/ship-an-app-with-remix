import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import type { Entry } from "@prisma/client";

export default function EntryForm({ entry }: { entry?: Entry }) {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (
      fetcher.type !== "init" &&
      fetcher.state === "idle" &&
      textareaRef.current
    ) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state, fetcher.type]);

  return (
    <fetcher.Form method="post" className="mt-2">
      <fieldset
        className="disabled:opacity-70"
        disabled={fetcher.state === "submitting"}
      >
        <div>
          <div>
            <input
              type="date"
              name="date"
              required
              className="text-gray-900"
              defaultValue={
                entry
                  ? format(new Date(entry.date), "yyyy-MM-dd")
                  : format(new Date(), "yyyy-MM-dd")
              }
            />
          </div>
          <div className="mt-4 space-x-4">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((category) => (
              <label key={category.value} className="inline-block">
                <input
                  required
                  type="radio"
                  defaultChecked={category.value === (entry?.type || "work")}
                  className="mr-1"
                  name="type"
                  value={category.value}
                />
                {category.label}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <textarea
            ref={textareaRef}
            placeholder="Type your entry..."
            name="text"
            className="w-full text-gray-700"
            required
            defaultValue={entry?.text}
          />
        </div>
        <div className="mt-2 text-right">
          <button
            type="submit"
            className="bg-blue-500 px-4 py-1 font-semibold text-white"
          >
            {fetcher.state === "submitting" ? "Saving..." : "Save"}
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
