import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
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
  let session = await getSession(request.headers.get("Cookie"));

  return session.data;
}

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      {data?.isAdmin ? (
        <span>Logged in!</span>
      ) : (
        <Form method="post">
          <input
            className="text-gray-900"
            placeholder="email"
            name="email"
            type="email"
          />
          <input
            className="text-gray-900"
            placeholder="password"
            name="password"
            type="password"
          />
          <button>Log in</button>
        </Form>
      )}
    </div>
  );
}
