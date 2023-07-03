create `entries.$entryId.edit.tsx`

Create EntryListItem for each type

```tsx
function EntryListItem({ entry }: { entry: Entry }) {
  return (
    <li className="group">
      <span>{entry.text}</span>
      <Link
        preventScrollReset
        to={`/entries/${entry.id}/edit`}
        className="ml-2 font-medium text-blue-500 opacity-0 focus:opacity-100 group-hover:opacity-100"
      >
        Edit
      </Link>
    </li>
  );
}
```