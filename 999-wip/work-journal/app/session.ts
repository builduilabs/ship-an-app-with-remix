import { createCookieSessionStorage } from "@remix-run/node";

const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  throw new Error("The ENV variable SESSION_SECRET must be set.");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "work-journal-session",
      secrets: [SECRET],

      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });
