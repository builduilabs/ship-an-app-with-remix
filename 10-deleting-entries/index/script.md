```tsx
<div className="mt-8">
  <Form method="post" onSubmit={handleDelete}>
    <button
      name="_action"
      value="delete"
      className="text-gray-500 underline"
    >
      Delete this entry...
    </button>
  </Form>
</div>
```

```tsx
let { _action, date, type, text } = Object.fromEntries(formData);

  if (_action === "delete") {
    await db.entry.delete({
      where: {
        id: +params.entryId,
      },
    });

    return redirect("/");
  } else {
```

```tsx
function handleDelete(event: FormEvent<HTMLFormElement>) {
  if (!confirm("Are you sure?")) {
    event.preventDefault();
  }
}
```