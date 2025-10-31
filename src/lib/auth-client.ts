import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  plugins: [adminClient()],
});

export const signInWithGoogle = async (nextUrl?: string) => {
  const data = await authClient.signIn.social({
    provider: "google",
    callbackURL: nextUrl,
  });
  return data;
};
