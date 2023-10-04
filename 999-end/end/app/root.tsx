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
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return {
    session: session.data,
  };
}

export async function action({ request }: ActionArgs) {
  let session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
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
        <div className="p-10">
          <div className="flex">
            <div>
              <h1 className="text-5xl">Work Journal</h1>
              <p className="mt-2 text-lg text-gray-400">
                Learnings and doings. Updated weekly.
              </p>
            </div>

            {session.isAdmin ? (
              <Form method="post" className="ml-auto">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-gray-200"
                >
                  Logout
                </button>
              </Form>
            ) : (
              <div className="ml-auto">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-200"
                >
                  Login
                </Link>
              </div>
            )}
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
  const error = useRouteError();

  return (
    <html className="h-full">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex min-h-full flex-col items-center justify-center">
          <ErrorMessage error={error} />
        </div>

        <Scripts />
      </body>
    </html>
  );
}

function ErrorMessage({ error }: { error: unknown }) {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  } else if (isRouteErrorResponse(error) && error.status === 401) {
    return <Unauthorized />;
  } else if (isRouteErrorResponse(error)) {
    return <DefaultRoutingError />;
  } else if (error instanceof Error) {
    return <DefaultError error={error} />;
  } else {
    return <DefaultUnknownError />;
  }
}

function NotFound() {
  return <p>404 not found</p>;
}

function Unauthorized() {
  return <p>401 - sorry buddy!</p>;
}

function DefaultRoutingError() {
  return <p>Default routing</p>;
}

function DefaultError({ error }: { error: Error }) {
  console.error(error);

  return (
    <div>
      <p>Something happened! </p>
      <p>{error.message}</p>
    </div>
  );
}

function DefaultUnknownError() {
  return <p>Default unknown</p>;
}
