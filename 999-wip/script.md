## Outline (Building a Work Journal with Remix)

### Error in login form

- Isn't this an error? Let's throw.

```tsx
throw new Response("Bad credentials", {
  status: 401,
  statusText: "Bad credentials",
});
```

Handling..but sucks. People mistype email all the time.

Return the response instead, and useActionData to update UI:

```tsx
let actionData = useActionData<typeof action>();

console.log(actionData);
```

Now update UI:

```tsx
{
  actionData === "Bad credentials" && (
    <p className="mt-4 font-medium text-red-500">Invalid login.</p>
  );
}
```

useActionData good - doesn't survive reload.

`actionData === "Bad credentials"` is brittle. Return a richer object.

## Rest

- Polish

- Deploy

- Upgrade to v2
  - Remix philosophy. Upgrade to last of current version, enable all flags, run tests (lol), then upgrade majors.

```

```
