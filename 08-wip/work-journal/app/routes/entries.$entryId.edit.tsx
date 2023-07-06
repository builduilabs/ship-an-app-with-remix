import { PrismaClient } from "@prisma/client";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EntryForm from "~/components/entry-form";

export async function action({ params, request }: ActionArgs) {
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

  await db.entry.update({
    where: { id: +params.entryId },
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });

  return redirect("/");
}

export async function loader({ params }: LoaderArgs) {
  let db = new PrismaClient();
  let entry = await db.entry.findUnique({ where: { id: +params.entryId } });

  return entry;
}

export default function Page() {
  let entry = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      <p className="text-xl">Edit entry</p>
      <div className="mt-8">
        <EntryForm entry={entry} />
      </div>
    </div>
  );
}
