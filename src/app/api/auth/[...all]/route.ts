import { getAuth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

function handler() {
  return toNextJsHandler(getAuth());
}

export async function GET(request: Request) {
  return handler().GET(request);
}

export async function POST(request: Request) {
  return handler().POST(request);
}
