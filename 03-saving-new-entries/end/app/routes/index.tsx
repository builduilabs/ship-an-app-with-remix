import { redirect, type ActionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";

export async function action({ request }: ActionArgs) {
  let db = new PrismaClient();

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad request");
  }

  await db.entry.create({
    data: {
      date: new Date(date),
      type: type,
      text: text,
    },
  });

  return redirect("/");
}

export default function Index() {
  return (
    <div className="p-10">
      <h1 className="text-5xl">Work Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

      <div className="my-8 border p-3">
        <p className="italic">Create a new entry</p>

        <Form method="post" className="mt-2">
          <div>
            <div>
              <input type="date" name="date" id="" className="text-gray-500" />
            </div>
            <div className="mt-4 space-x-4">
              <label className="inline-block">
                <input type="radio" className="mr-1" name="type" value="work" />
                Work
              </label>
              <label className="inline-block">
                <input
                  type="radio"
                  className="mr-1"
                  name="type"
                  value="learning"
                />
                Learning
              </label>
              <label className="inline-block">
                <input
                  type="radio"
                  className="mr-1"
                  name="type"
                  value="interesting-thing"
                />
                Interesting thing
              </label>
            </div>
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Type your entry..."
              name="text"
              id=""
              className="w-full text-gray-700"
            />
          </div>
          <div className="mt-2 text-right">
            <button
              type="submit"
              className="bg-blue-500 px-4 py-1 font-semibold text-white"
            >
              Save
            </button>
          </div>
        </Form>
      </div>

      <div className="mt-6">
        <p className="font-bold">
          Week of February 27<sup>th</sup>
        </p>

        <div className="mt-3 space-y-4">
          <div>
            <p>Work</p>
            <ul className="ml-8 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Learnings</p>
            <ul className="ml-8 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
          <div>
            <p>Interesting things</p>
            <ul className="ml-8 list-disc">
              <li>First item</li>
              <li>Second item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
