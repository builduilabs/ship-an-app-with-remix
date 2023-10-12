## Outline (Building a Work Journal with Remix)

- Are we done? UI is "secure". Show that actions need to be secured.
  - Replay curl delete, change URL.

```

curl 'http://localhost:3000/entries/31/edit?\_data=routes%2Fentries.%24entryId.edit' \
 --data-raw '\_action=delete'

```

- So, need to secure actions.

  - In edit action, return 401 if session.data.isAdmin is not true.

```tsx
let session = await getSession(request.headers.get("cookie"));
if (!session.data.isAdmin) {
  throw new Response("Not authorized", { status: 401 });
}
```

- Try to replay it CURL - see "Not authorized". Done!
- Also done for edit!

- Add it to action on index (CREATE).

- So, actions and loaders are secure. Every action and loader is an endpint that's exposed by our server. So the security happens here. What we did in last video is more about UX – but had nothing to do with security. Always want to secure actions (unauthorized mutations coming in) and loaders (sensitive data going out), so our data is secure. Also helps if a bad UX flow makes it into our app.

- Summary: We've secured actions from requests from non-authed clients, and we've secured loaders so our users don't encounter flows they don't have access to – better ux. But let's say we forgot to hide the form for guests. We can see if we show it and try to submit, we get an 401. {session.isAdmin} to hide form is about UX – it has nothing to do with security. But the actions make sure our backend data is secure regardless if we have bad UX flows that make it into the app.
- Even if you've secured all your actions, errors are still inevitable. We can see them here if we visit a entry edit route by hand (401) or a bogus URL.

- Error boundary & UI

  - Add future v2_errorBoundary: true, write it as v2 app. At end of course we'll upgrade the final app to v2.
  - Create ErrorBoundary with single Woops
  - show it works for the 401, the 404, and also add `throw new Error("database is on vacation")`. Works for all 3
  - Customize the error boundary based on the type error.
    - Use `const error = useRouteError()`, log it. See all the info. Nice, bubbles up from anywhere in the app.
    - Switch on error stuff. There's a `isRouteErrorResponse`, so we know were dealing with RouteError, meaning we have status code + statusText and can use that in our UI. But can also do whatever want - add links home, add login.
    - Then we switch Error instance, and we have a `message` we can use. Maybe to display to user, maybe note.
    - Finally we have an exception that is not an instance of Error, we know less about it.

- Santized for prod so error.message is safe
- We handled in root, but nested routes can export their own error boundary

- Polish

- Deploy

- Upgrade to v2
  - Remix philosophy. Upgrade to last of current version, enable all flags, run tests (lol), then upgrade majors.

```

```
