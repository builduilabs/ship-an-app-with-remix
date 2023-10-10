# Script

## Step: Login route

Add login route:

```tsx
import { Form } from "@remix-run/react";

export default function LoginPage() {
  let isAdmin = false;

  return (
    <div className="mt-8">
      {isAdmin ? (
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
```

## Step: Action + actionData

Create an action

```tsx
export async function action({ request }: ActionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "sam@buildui.com" && password === "password") {
    return { isAdmin: true };
  } else {
    return { isAdmin: false };
  }
}
```

then use action data

```tsx
const data = useActionData<typeof action>();
data?.isAdmin
```

Problem: doesn't survive reloads! HTTP is stateless. Need data that's durable that we can associate with subsequent HTTP requests.

Solution: This is where Sessions come in.

## Step: Cookies

```tsx
if (email === "sam@buildui.com" && password === "password") {
  return new Response("", {
    headers: {
      "Set-Cookie": "admin=1",
    },
  });
}
```

```tsx
export async function loader({ request }: LoaderArgs) {
  let admin = request.headers.get("Cookie")?.split("=")[1];

  return { isAdmin: admin === "1" };
}
```

```tsx
const data = useLoaderData<typeof loader>();
data?.isAdmin
```

Works!

Problem: wiring/parsing/encoding, but also insecure (set admin: true)

## Step: createCookieSessionStorage

```tsx
const storage = createCookieSessionStorage({
  cookie: {
    name: "work-journal-session",
    // secrets: ["build-ui-secret"],
    // sameSite: "lax",
    // path: "/",
    // maxAge: 60 * 60 * 24 * 30,
    // httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
  },
});

let session = await storage.getSession();
session.set("isAdmin", true);
return new Response("", {
  headers: { "Set-Cookie": await storage.commitSession(session) },
});
```

Look in browser - there it is! Base64 encoded to prevent transmission problems – let's decode it with atob (ascii to binary):

`atob("eyJpc0FkbWluIjp0cnVlfQ==")`

There it is!

Now, read from storage in loader:

```tsx
export async function loader({ request }: LoaderArgs) {
  const storage = createCookieSessionStorage({
    cookie: {
      name: "work-journal-session",
      // secrets: ["build-ui-secret"],
      // sameSite: "lax",
      // path: "/",
      // maxAge: 60 * 60 * 24 * 30,
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    },
  });
  let session = await storage.getSession(request.headers.get("Cookie"));
  console.log(session.data);
  return session.data;
}
```

Awesome!

## Step: Extract

```tsx
// app/session.ts
import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "work-journal-session",
      secrets: ["build-ui-secret"],

      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });

```

Then secret (warning in dev console)

Then rest of options.

## Step: Redirect

```tsx
return redirect("/", {
  headers: { "Set-Cookie": await commitSession(session) },
});
```

## Step: Use on homepage

```tsx
export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  let db = new PrismaClient();
  let entries = await db.entry.findMany();

  return {
    session: session.data,
    entries: entries.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  };
}
```

Update type in component.

Use in page to conditionally render form.
