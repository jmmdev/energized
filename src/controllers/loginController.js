"use server";

import { signIn, signOut } from "@/auth";

export async function doLogout() {
    await signOut({ redirect: false })
}

export async function doCredentialsLogin(formData) {
    try {
        const response = await signIn("credentials", {
            user: formData.get("identifier"),
            password: formData.get("password"),
            redirect: false,
        });
        return response;
    }
    catch (err) {
        if (err.type === "CallbackRouteError") {
            throw new Error(err.cause.err);
        }
    }
}