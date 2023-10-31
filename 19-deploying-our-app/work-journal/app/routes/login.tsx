import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/session";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "sam@buildui.com" && password === "password") {
    let session = await getSession();
    session.set("isAdmin", true);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    let error;

    if (!email) {
      error = "Email is required.";
    } else if (!password) {
      error = "Password is required.";
    } else {
      error = "Invalid login.";
    }

    return json({ error }, 401);
  }
}

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return session.data;
}

export default function LoginPage() {
  let data = useLoaderData<typeof loader>();
  let actionData = useActionData<typeof action>();

  return (
    <div className="mx-auto mt-8 max-w-xs lg:max-w-sm">
      {data.isAdmin ? (
        <p>You're signed in!</p>
      ) : (
        <Form method="post">
          <div className="space-y-2">
            <input
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              type="email"
              name="email"
              required
              placeholder="Email"
            />
            <input
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              type="password"
              name="password"
              required
              placeholder="Password"
            />
          </div>

          <div className="mt-8">
            <button className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
              Log in
            </button>
          </div>

          {actionData?.error && (
            <p className="mt-4 font-medium text-red-500">{actionData.error}</p>
          )}
        </Form>
      )}
    </div>
  );
}
