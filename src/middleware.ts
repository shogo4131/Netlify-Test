import { NextRequest, NextResponse } from "next/server";
import { Buffer } from "buffer";

export function middleware(req: NextRequest) {
  if (process.env.NEXT_STAGING_ENV) return NextResponse.next();

  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const auth = basicAuth.split(" ")[1];
    const [user, pwd] = Buffer.from(auth, "base64").toString().split(":");

    if (
      user === process.env.NEXT_PUBLIC_USER &&
      pwd === process.env.NEXT_PUBLIC_PASS
    ) {
      return NextResponse.next();
    }
  }

  return NextResponse.next({
    status: 401,
    headers: {
      "WWW-Authenticate": "Basic realm=realm",
    },
  });
}
