import { useFetcher } from "@remix-run/react";
import { useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry: {
    text: string;
    date: string;
    type: string;
  };
}) {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

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
              defaultValue={entry.date}
            />
          </div>

          <div className="mt-4 space-x-4">
            <label className="inline-block">
              <input
                required
                type="radio"
                className="mr-1"
                name="type"
                value="work"
                defaultChecked={entry.type === "work"}
              />
              Work
            </label>
            <label className="inline-block">
              <input
                type="radio"
                className="mr-1"
                name="type"
                value="learning"
                defaultChecked={entry.type === "learning"}
              />
              Learning
            </label>
            <label className="inline-block">
              <input
                type="radio"
                className="mr-1"
                name="type"
                value="interesting-thing"
                defaultChecked={entry.type === "interesting-thing"}
              />
              Interesting thing
            </label>
          </div>
        </div>
        <div className="mt-4">
          <textarea
            ref={textareaRef}
            placeholder="Type your entry..."
            name="text"
            className="w-full text-gray-700"
            required
            defaultValue={entry.text}
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
