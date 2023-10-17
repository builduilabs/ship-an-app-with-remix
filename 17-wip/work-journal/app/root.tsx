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
      <body>
        <header className="flex justify-between px-4 pt-4 text-sm">
          <a className="font-light uppercase" href="https://samselikoff.com/">
            <span className="text-gray-400">Sam</span>
            <span className="font-bold">Selikoff</span>
          </a>

          <div className="font-medium text-gray-500">
            {session.isAdmin ? (
              <Form method="post">
                <button>Logout</button>
              </Form>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </header>

        <div className="px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-semibold tracking-tighter text-white">
                Work Journal
              </h1>

              <p className="mt-5 text-lg tracking-tight">
                Doings and learnings. Updated weekly.
              </p>
            </div>
          </div>

          <Outlet />
        </div>

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
