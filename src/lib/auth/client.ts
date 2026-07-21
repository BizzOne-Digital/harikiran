import { createAuthClient } from "better-auth/react";

/** Same-origin relative API — works on any local port (3000/3001/3002…). */
export const authClient = createAuthClient();
