Auth

1. Step

   - if email/pw match, return admin: true
   - doesn’t survive refresh
   - problem: use something durable

2. Step: Use cookie storage
   - if email/pw match, return Response({ headers: set-cookie: “admin=true” })
     - TODO: Check this
   - Read cookie in loader
   - solves: survive refresh
   - problem: wiring/parsing/encoding, but also insecure (set admin: true)

- Step: Use Remix storage
  - paste in
  - secret makes sure it can’t be tampered - liek you saw, we can change cookie value from browser, but with a secret remix storage verifies the client hasn’t changed anything. so it’s secure data.
  - sameSite/path/maxAge/httpOnly, good defaults for auth sessions. HTTP spec level options.

```tsx
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
```

```tsx
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
```
