import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry?: {
    text: string;
    date: string;
    type: string;
  };
}) {
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
        disabled={fetcher.state !== "idle"}
      >
        <div className="items-center lg:flex lg:justify-between">
          <div className="lg:order-2">
            <input
              type="date"
              name="date"
              required
              style={{ colorScheme: "dark" }}
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="mt-4 space-x-4 lg:mt-0 lg:space-x-6">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label
                key={option.value}
                className="inline-block text-sm text-white lg:text-base"
              >
                <input
                  required
                  type="radio"
                  className="focus:sky-600 mr-2 border-gray-700 bg-gray-800 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-900"
                  name="type"
                  value={option.value}
                  defaultChecked={option.value === (entry?.type ?? "work")}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 lg:mt-8">
          <textarea
            ref={textareaRef}
            placeholder="Type your entry..."
            name="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-1 focus:ring-inset focus:ring-sky-600"
            required
            defaultValue={entry?.text}
            rows={3}
          />
        </div>

        <div className="mt-4 text-right">
          <button
            type="submit"
            className="rounded-md bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {fetcher.state !== "idle" ? "Saving..." : "Save"}
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
