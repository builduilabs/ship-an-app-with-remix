import { type LoaderArgs, type ActionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/session";

export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "sam@buildui.com" && password === "password") {
    let session = await getSession();
    session.set("isAdmin", true);

    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } else {
    return null;
  }
}

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return session.data;
}

export default function LoginPage() {
  let data = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      {data.isAdmin ? (
        <p>You're signed in!</p>
      ) : (
        <Form method="post">
          <input
            className="text-gray-900"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="text-gray-900"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button className="ml-2 bg-blue-500 px-3 py-2 font-medium text-white">
            Log in
          </button>
        </Form>
      )}
    </div>
  );
}
