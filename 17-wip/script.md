## Logged out UI first

## Inter font

Download, zip, public/fonts/inter

Update links in root.tsx

```jsx
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: "/fonts/inter/inter.css" },
];
```

```js
// tailwind.config.js
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

```

## Color

Make default gray zinc:

```js
colors: {
  gray: colors.zinc,
},
```

Make default text color gray-300:

```css
/* tailwind.css */

html {
  @apply bg-gray-900 text-gray-300 antialiased;
}
```

## Header

```jsx
<body>
  <header className="flex justify-between px-4 pt-4 text-sm">
    <a className="font-light uppercase" href="https://samselikoff.com/">
      <span className="text-gray-400">Sam</span>
      <span className="font-bold">Selikoff</span>
    </a>

    <div className="text-gray-500 font-medium">
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

        <p className="mt-6 text-lg tracking-tight text-gray-500">
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
```

## Index

- Sort entries reverse chronological

Sort in loader (remove .sort)

```tsx
let entries = await db.entry.findMany({ orderBy: { date: "desc" } });
```

## Next

- 