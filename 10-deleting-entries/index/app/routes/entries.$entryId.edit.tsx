import { PrismaClient } from "@prisma/client";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import type { FormEvent } from "react";
import EntryForm from "~/components/entry-form";

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

export async function action({ request, params }: ActionArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404 });
  }

  let formData = await request.formData();
  let { _action, date, type, text } = Object.fromEntries(formData);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  let db = new PrismaClient();

  if (_action === "delete") {
    await db.entry.delete({
      where: {
        id: +params.entryId,
      },
    });

    return redirect("/");
  } else {
    if (
      typeof date !== "string" ||
      typeof type !== "string" ||
      typeof text !== "string"
    ) {
      throw new Error("Bad request");
    }

    await db.entry.update({
      where: {
        id: +params.entryId,
      },
      data: {
        date: new Date(date),
        type: type,
        text: text,
      },
    });

    return redirect("/");
  }
}

export default function EditPage() {
  let entry = useLoaderData<typeof loader>();

  function handleDelete(event: FormEvent<HTMLFormElement>) {
    if (!confirm("Are you sure?")) {
      event.preventDefault();
    }
  }

  return (
    <div className="mt-4">
      <p>
        Editing your {format(new Date(entry.date), "MMM do")} {entry.type} entry
      </p>

      <div className="mt-8">
        <EntryForm entry={entry} />
      </div>

      <div className="mt-8">
        <Form method="post" onSubmit={handleDelete}>
          <button
            name="_action"
            value="delete"
            className="text-gray-500 underline"
          >
            Delete this entry...
          </button>
        </Form>
      </div>
    </div>
  );
}
