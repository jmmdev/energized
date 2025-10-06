"use server";

import { signIn, signOut } from "@/auth";

export async function doLogout() {
    await signOut({ redirect: false })
}

export async function doCredentialsLogin(formData) {
    const result = await signIn("credentials", {
        user: formData.get("user"),
        password: formData.get("password"),
        redirect: false,
    });

    if (result?.error) {
        alert(result.error || "Email or password are invalid.");
    } 
    else if (result?.ok) {
        return result;
    }
}