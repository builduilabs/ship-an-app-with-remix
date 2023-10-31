import { createCookieSessionStorage } from "@remix-run/node";

let SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("ENV variable SESSION_SECRET must be defined.");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "work-journal-session",
      secrets: [SESSION_SECRET],

      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });
