## Logged out UI first

## Inter font

Download, zip, public/fonts/inter

Update links in root.tsx

```jsx
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "/fonts/inter/inter.css" },
];
```

```js
// tailwind.config.js
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

```

## Color

Make default gray zinc:

```js
colors: {
  gray: colors.zinc,
},
```

Make default text color gray-300:

```css
/* tailwind.css */

html {
  @apply bg-gray-900 text-gray-300 antialiased;
}
```

## Header

```tsx
export default function App() {
  let { session } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header className="mx-auto flex max-w-screen-xl justify-between px-4 pt-4 text-sm">
          <a className="font-light uppercase" href="https://samselikoff.com/">
            <span className="text-gray-500">Sam</span>
            <span className="font-semibold text-gray-400">Selikoff</span>
          </a>

          <div className="font-medium text-gray-500">
            {session.isAdmin ? (
              <Form method="post">
                <button>Logout</button>
              </Form>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-semibold tracking-tighter text-white">
                Work Journal
              </h1>

              <p className="mt-5 text-lg tracking-tight text-gray-500">
                Doings and learnings. Updated weekly.
              </p>
            </div>
          </div>

          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

## Index

- Sort entries reverse chronological

Sort in loader (remove .sort)

```tsx
let entries = await db.entry.findMany({ orderBy: { date: "desc" } });
```

Final page:

```tsx
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
        <div className="my-8 rounded-md border border-gray-500 p-3">
          <p className="text-sm font-medium">New entry</p>

          <EntryForm />
        </div>
      )}

      <div className="relative mt-14 space-y-16 border-l-2 border-sky-500/[.15] pl-5">
        {weeks.map((week) => (
          <div key={week.dateString} className="">
            <div className="absolute -left-[6px] h-[10px] w-[10px] rounded-full border border-sky-500 bg-gray-900" />

            <p className="mb-3 pb-3 text-xs font-semibold uppercase leading-[11px] tracking-wider text-sky-500">
              {format(parseISO(week.dateString), "MMMM d, yyyy")}
            </p>
            <div className="mt-3 space-y-6">
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
      <p className="text-[15px] font-semibold text-gray-100">{label}</p>

      <ul className="mt-2 ml-4 list-disc">
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

```

## Next

- 