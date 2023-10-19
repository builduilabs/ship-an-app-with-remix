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
        <div className="my-8 rounded-lg bg-gray-800/50 p-4 shadow-md ring-1 ring-inset ring-white/5 lg:p-6">
          <p className="text-sm font-medium text-gray-500 lg:text-base">
            New entry
          </p>

          <div className="mt-4">
            <EntryForm />
          </div>
        </div>
      )}

      <div className="relative mt-14 space-y-16 border-l-2 border-sky-500/[.15] pl-5 lg:mt-24 lg:space-y-20 lg:pl-8">
        {weeks.map((week) => (
          <div key={week.dateString}>
            <div className="absolute left-[-12px] rounded-full bg-gray-900 p-1.5">
              <div className="h-[10px] w-[10px] rounded-full border border-sky-500 bg-gray-900" />
            </div>

            <p className="mb-3 pb-3 text-xs font-semibold uppercase leading-[22px] tracking-wider text-sky-500 lg:text-sm lg:leading-[24px]">
              {format(parseISO(week.dateString), "MMMM d, yyyy")}
            </p>
            <div className="mt-3 space-y-8 lg:space-y-12">
              <EntryList label="Work" entries={week.work} />
              <EntryList label="Learnings" entries={week.learnings} />
              <EntryList
                label="Interesting things"
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
      <p className="font-semibold text-white">{label}</p>

      <ul className="mt-4  space-y-6">
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
    <li className="group leading-7">
      {entry.text}

      {session.isAdmin && (
        <Link
          to={`/entries/${entry.id}/edit`}
          className="ml-2 text-sm font-medium text-sky-500 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Link>
      )}
    </li>
  );
}
