import LoginForm from "@/components/LoginForm"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import StarBackground from "@/components/StarBackground";

export default async function LoginPage() {

    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/home");
    }

    return (
        <StarBackground>
            <LoginForm />
        </StarBackground>
    )
}