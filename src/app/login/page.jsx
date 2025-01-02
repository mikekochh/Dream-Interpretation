"use client";
import LoginForm from "@/components/LoginForm"
import { redirect } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function LoginPage() {

    const { user } = useContext(UserContext);

    if (user) {
        redirect("/");
    }

    return (<LoginForm />)
}
