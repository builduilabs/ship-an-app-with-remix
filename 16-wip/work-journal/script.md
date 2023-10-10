## Outline (Building a Work Journal with Remix)

- Error boundary & UI

  - Add future v2_errorBoundary: true, write it as v2 app. At end of course we'll upgrade the final app to v2.

```
v2_errorBoundary: true,
```

- Create ErrorBoundary with single Woops

```tsx
export function ErrorBoundary() {
  return (
    <html className="h-full">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="flex min-h-full flex-col items-center justify-center">
          Whoops - something went wrong!
        </div>

        <Scripts />
      </body>
    </html>
  );
}
```

- show it works for the 401, the 404, and also add `throw new Error("database is on vacation")`. Works for all 3

- Customize the error boundary based on the type error.

  - Use `const error = useRouteError()`, log it. See all the info. Nice, bubbles up from anywhere in the app.
  - Switch on error stuff. There's a `isRouteErrorResponse`, so we know were dealing with RouteError, meaning we have status code + statusText and can use that in our UI. But can also do whatever want - add links home, add login.
  - Then we switch Error instance, and we have a `message` we can use. Maybe to display to user, maybe note.

    - Santized for prod so error.message is safe

  - Finally we have an exception that is not an instance of Error, we know less about it.

```tsx
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
```

- We handled in root, but nested routes can export their own error boundary

- Polish

- Deploy

- Upgrade to v2
  - Remix philosophy. Upgrade to last of current version, enable all flags, run tests (lol), then upgrade majors.

```

```
