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
      error = "Email can't be blank.";
    } else if (!password) {
      error = "Password can't be blank.";
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
    <div className="mt-8">
      {data.isAdmin ? (
        <p>You're signed in!</p>
      ) : (
        <Form method="post">
          <input
            required
            className="text-gray-900"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            required
            className="text-gray-900"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button className="bg-blue-500 px-3 py-2 font-medium text-white">
            Log in
          </button>

          {actionData?.error && (
            <p className="mt-4 font-medium text-red-500">{actionData.error}</p>
          )}
        </Form>
      )}
    </div>
  );
}
