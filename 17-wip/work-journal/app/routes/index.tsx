import { PrismaClient } from "@prisma/client";
import { type LoaderArgs, type ActionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import EntryForm from "~/components/entry-form";
import { getSession } from "~/session";

export async function action({ request }: ActionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", {
      status: 401,
      statusText: "Not authenticated",
    });
  }

  let db = new PrismaClient();

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad request");
  }

  return db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });
}

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("cookie"));

  let db = new PrismaClient();
  let entries = await db.entry.findMany();

  return {
    session: session.data,
    entries: entries.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  };
}

type Entry = Awaited<ReturnType<typeof loader>>["entries"][number];

export default function Index() {
  let { session, entries } = useLoaderData<typeof loader>();

  let entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (memo, entry) => {
      let sunday = startOfWeek(parseISO(entry.date));
      let sundayString = format(sunday, "yyyy-MM-dd");

      memo[sundayString] ||= [];
      memo[sundayString].push(entry);

      return memo;
    },
    {}
  );

  let weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter((entry) => entry.type === "work"),
      learnings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "learning"
      ),
      interestingThings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "interesting-thing"
      ),
    }));

  return (
    <div>
      {session.isAdmin && (
        <div className="my-8 rounded-md border border-gray-500 p-3">
          <p className="text-sm font-medium">New entry</p>

          <EntryForm />
        </div>
      )}

      <div className="relative mt-14 space-y-16 border-l border-sky-500/25 pl-6">
        {weeks.map((week) => (
          <div key={week.dateString} className="">
            <div className="absolute -left-[7px] h-[14px] w-[14px] rounded-full border border-sky-500/25 bg-gray-900"></div>

            <p className="mb-3 pb-3 text-xs font-semibold leading-[14px] text-sky-500">
              {format(parseISO(week.dateString), "MMMM d, yyyy")}
            </p>
            {/* <p className="mb-3 border-b border-sky-500/50 pb-3 text-sm font-medium text-sky-500">
              {format(parseISO(week.dateString), "MMMM d, yyyy")}
            </p> */}
            {/* <p className="text-xs font-bold uppercase tracking-wider text-sky-500">
              {format(parseISO(week.dateString), "MMM d yyyy")}
            </p> */}
            <div className="mt-3 space-y-4">
              <EntryList label="Work" entries={week.work} />
              <EntryList label="Learnings" entries={week.learnings} />
              <EntryList
                label="Intereesting things"
                entries={week.interestingThings}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntryList({ label, entries }: { label: string; entries: Entry[] }) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="font-bold text-gray-100">{label}</p>

      <ul className="mt-4 ml-4 list-disc">
        {entries.map((entry) => (
          <EntryListItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  );
}

function EntryListItem({ entry }: { entry: Entry }) {
  let { session } = useLoaderData<typeof loader>();

  return (
    <li className="group">
      {entry.text}

      {session.isAdmin && (
        <Link
          to={`/entries/${entry.id}/edit`}
          className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Link>
      )}
    </li>
  );
}
