import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "work-journal-session",
      secrets: ["build-ui-secret"],

      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  });
