# Script

- VSCode extension

```sh
npm install --save-dev prisma
npm install @prisma/client
```

```sh
npx prisma init --datasource-provider sqlite
```

```prisma
prisma.schema
model Joke {
  id         String   @id @default(uuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  name       String
  content    String
}
```

```sh
npx prisma db push
```

💿 Let's add that prisma/dev.db to our .gitignore so we don't accidentally commit it to our repository. We'll also want to add the .env file to the .gitignore as mentioned in the prisma output so we don't commit our secrets!

- you can always delete dev.db, rerun npx prisma db push

```
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
```

db limit

```
import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  db = global.__db;
}

export { db };
```
