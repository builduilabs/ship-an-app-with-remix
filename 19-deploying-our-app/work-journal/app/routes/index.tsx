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
  let entries = await db.entry.findMany({ orderBy: { date: "desc" } });

  return {
    session: session.data,
    entries: entries.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  };
}

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

  let weeks = Object.keys(entriesByWeek).map((dateString) => ({
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
        <div className="mb-8 rounded-lg border border-gray-700/30 bg-gray-800/50 p-4 lg:mb-20 lg:p-6">
          <p className="text-sm font-medium text-gray-500 lg:text-base">
            New entry
          </p>

          <EntryForm />
        </div>
      )}

      <div className="mt-12 space-y-12 border-l-2 border-sky-500/[.15] pl-5 lg:space-y-20 lg:pl-8">
        {weeks.map((week) => (
          <div key={week.dateString} className="relative">
            <div className="absolute left-[-34px] rounded-full bg-gray-900 p-2 lg:left-[-46px]">
              <div className="h-[10px] w-[10px] rounded-full border border-sky-500 bg-gray-900" />
            </div>

            <p className="pt-[5px] text-xs font-semibold uppercase tracking-wider text-sky-500 lg:pt-[3px] lg:text-sm">
              Week of {format(parseISO(week.dateString), "MMMM d, yyyy")}
            </p>

            <div className="mt-6 space-y-8 lg:space-y-12">
              <EntryList entries={week.work} label="Work" />
              <EntryList entries={week.learnings} label="Learnings" />
              <EntryList
                entries={week.interestingThings}
                label="Interesting things"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Entry = Awaited<ReturnType<typeof loader>>["entries"][number];

function EntryList({ entries, label }: { entries: Entry[]; label: string }) {
  return entries.length > 0 ? (
    <div>
      <p className="font-semibold text-white">{label}</p>

      <ul className="mt-4 space-y-6">
        {entries.map((entry) => (
          <EntryListItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  ) : null;
}

function EntryListItem({ entry }: { entry: Entry }) {
  let { session } = useLoaderData<typeof loader>();

  return (
    <li className="group leading-7">
      {entry.text}

      {session.isAdmin && (
        <Link
          to={`/entries/${entry.id}/edit`}
          className="ml-2 text-sky-500 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Link>
      )}
    </li>
  );
}
