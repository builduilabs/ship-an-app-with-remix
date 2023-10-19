import {
  redirect,
  type ActionArgs,
  type LinksFunction,
  type MetaFunction,
  type LoaderArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import { destroySession, getSession } from "./session";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "/fonts/inter/inter.css" },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function action({ request }: ActionArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return { session: session.data };
}

export default function App() {
  let { session } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="mx-auto max-w-xl px-4 lg:max-w-7xl">
        <header className="mx-auto flex max-w-screen-xl items-center justify-between pt-4 lg:border-b lg:border-gray-800 lg:py-5">
          <a
            className="text-sm uppercase lg:text-lg"
            href="https://samselikoff.com/"
          >
            <span className="text-gray-500">Sam</span>
            <span className="font-semibold text-gray-200">Selikoff</span>
          </a>

          <div className="text-sm font-medium text-gray-500 hover:text-gray-200">
            {session.isAdmin ? (
              <Form method="post">
                <button>Log out</button>
              </Form>
            ) : (
              <Link to="/login">Log in</Link>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-2xl py-12 lg:max-w-3xl lg:py-20">
          <div className="mt-8 mb-20">
            <h1 className="text-center text-5xl font-semibold tracking-tighter text-white lg:text-7xl">
              <Link to="/">Work Journal</Link>
            </h1>
            <p className="mt-2 text-center tracking-tight text-gray-500 lg:mt-4 lg:text-2xl">
              Doings and learnings. Updated weekly.
            </p>
          </div>

          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col items-center justify-center">
        <p className="text-3xl">Whoops!</p>

        {isRouteErrorResponse(error) ? (
          <p>
            {error.status} – {error.statusText}
          </p>
        ) : error instanceof Error ? (
          <p>{error.message}</p>
        ) : (
          <p>Something happened.</p>
        )}

        <Scripts />
      </body>
    </html>
  );
}
