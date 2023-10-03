## Outline

- Customize UI

  - Hide Edit link
  - But, can visit /edit. Need to hide the route. 404 it.

- Are we done? Show that actions need to be secured.
  - Replay curl delete, change URL.

```
curl 'http://localhost:3000/entries/31/edit?_data=routes%2Fentries.%24entryId.edit' \
  --data-raw '_action=delete'
```

- So, need to secure actions.
  - Secure DELETE action, try to replay it
- Then same pattern for CREATE and EDIT.

- Error boundary & UI
