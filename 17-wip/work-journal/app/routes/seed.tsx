import { Form } from "@remix-run/react";
import seeds from "../seeds.json";
import { PrismaClient } from "@prisma/client";

export async function action() {
  console.log("seeding...");
  console.log(seeds);
  let db = new PrismaClient();

  for (const week of seeds.Weeks) {
    for (const activity of week.Activities) {
      for (const entry of activity.Items) {
        await db.entry.create({
          data: {
            date: new Date(week.Date),
            type: activity.Category,
            text: entry,
          },
        });
      }
    }
  }
  return null;
}

export default function SeedPage() {
  return (
    <Form method="post">
      <button>Seed</button>
    </Form>
  );
}
