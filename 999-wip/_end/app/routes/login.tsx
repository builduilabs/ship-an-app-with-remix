import {
  ActionArgs,
  LoaderArgs,
  createCookieSessionStorage,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";

export async function action({ request, params }: ActionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "sam@buildui.com" && password === "asdf;lkj") {
    // log in
    const storage = createCookieSessionStorage({
      cookie: {
        name: "work-journal-session",
        // normally you want this to be `secure: true`
        // but that doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        // secure: process.env.NODE_ENV === "production",
        secrets: ["build-ui-secret"],

        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
      },
    });
    let session = await storage.getSession();
    session.set("admin", true);

    // atob(decodeURIComponent('eyJhZG1pbiI6dHJ1ZX0%3D'))
    // encodeURIComponent(btoa('{"admin":true}'))

    return new Response("", {
      headers: {
        "Set-Cookie": await storage.commitSession(session),
      },
    });
  } else {
    throw new Response("Not authorized", { status: 401 });
  }

  // console.log(data);
}

export async function loader({ request }: LoaderArgs) {
  const storage = createCookieSessionStorage({
    cookie: {
      name: "work-journal-session",
      // normally you want this to be `secure: true`
      // but that doesn't work on localhost for Safari
      // https://web.dev/when-to-use-local-https/
      // secure: process.env.NODE_ENV === "production",
      secrets: ["build-ui-secret"],

      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  });

  // Step 1: Show manual
  // let cookie = request.headers.get("Cookie");
  // if (typeof cookie === "string") {
  //   let data = JSON.parse(atob(decodeURIComponent(cookie.split("=")[1])));
  //   console.log(data);
  //   return data;
  // }

  // Step 2: Remix storage does this for us
  let session = await storage.getSession(request.headers.get("Cookie"));
  console.log(session.data);
  return session.data;
  // return true;

  // Step 3: Remix storage does this for us
}

export default function LoginPage() {
  // const data = useActionData<typeof action>();
  let data = useLoaderData<typeof loader>();

  return (
    <div>
      {data?.admin ? (
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
