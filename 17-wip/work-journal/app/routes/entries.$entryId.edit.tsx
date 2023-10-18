import { PrismaClient } from "@prisma/client";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { FormEvent } from "react";
import EntryForm from "~/components/entry-form";
import { getSession } from "~/session";

export async function loader({ params, request }: LoaderArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }

  let db = new PrismaClient();
  let entry = await db.entry.findUnique({ where: { id: +params.entryId } });

  if (!entry) {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }

  let session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", {
      status: 401,
      statusText: "Not authenticated",
    });
  }

  return {
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  };
}

export async function action({ request, params }: ActionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", {
      status: 401,
      statusText: "Not authenticated",
    });
  }

  if (typeof params.entryId !== "string") {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }

  let db = new PrismaClient();

  let formData = await request.formData();

  let { _action, date, type, text } = Object.fromEntries(formData);

  await new Promise((resolve) => setTimeout(resolve, 1000));

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!confirm("Are you sure?")) {
      e.preventDefault();
    }
  }

  return (
    <div className="mt-6">
      <div className="my-8 rounded-lg bg-gray-800/50 px-4 pt-3 pb-4 shadow-md ring-1 ring-inset ring-white/5">
        <p className="text-sm font-medium text-gray-500">Edit entry</p>

        <div className="mt-4">
          <EntryForm entry={entry} />
        </div>
      </div>

      <div className="mt-8">
        <Form method="post" onSubmit={handleSubmit}>
          <button
            name="_action"
            value="delete"
            className="text-sm text-gray-600 underline"
          >
            Delete this entry...
          </button>
        </Form>
      </div>
    </div>
  );
}
