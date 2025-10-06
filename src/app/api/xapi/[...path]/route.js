import { NextResponse } from "next/server";
import { auth } from "@/auth";

const API_BASE = process.env.SERVER_URL;

async function proxy(req, { params }) {
  const segs = params?.path || [];
  const search = new URL(req.url).search;
  const target = `${API_BASE}/${segs.join("/")}${search}`;

  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = {
    accept: req.headers.get("accept") || "",
    ...(req.headers.get("content-type")
      ? { "content-type": req.headers.get("content-type") }
      : {}),
    ...(session.accessToken
      ? { Authorization: `Bearer ${session.accessToken}` }
      : {}),
  };

  const method = req.method;
  const body =
    method === "GET" || method === "HEAD" ? undefined : await req.text();

  const r = await fetch(target, {
    method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
  });

  const outHeaders = new Headers();
  const ct = r.headers.get("content-type");
  if (ct) outHeaders.set("content-type", ct);

  return new NextResponse(r.body, { status: r.status, headers: outHeaders });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as OPTIONS,
};