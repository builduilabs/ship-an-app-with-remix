# Script

## Make link

```jsx
<Link
  className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
  to="/"
>
  Edit
</Link>
```

## New URL

```tsx
// routes/entries.$entryId.edit.tsx
import { PrismaClient } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
  }

  let db = new PrismaClient();
  let entry = await db.entry.findUnique({ where: { id: +params.entryId } });

  if (!entry) {
    throw new Response("Not found", { status: 404 });
  }

  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export default function Page() {
  let entry = useLoaderData<typeof loader>();
  console.log(entry);

  return <p>Editing entry</p>;
}
```

## Layout


## EntryListItem

```tsx
function EntryListItem({
  entry,
}: {
  entry: Awaited<ReturnType<typeof loader>>[number];
}) {
  return (
    <li className="group">
      {entry.text}

      <Link
        className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
        to={`/entries/${entry.id}/edit`}
      >
        Edit
      </Link>
    </li>
  );
}

```

## Rest

Add requireds.

Add default values.

Date.

```jsx
defaultValue={format(new Date(), "yyyy-MM-dd")}
```

Still want required in case user clears.

fieldet, disabled = submitting

Disable JavaScript

max-width?
