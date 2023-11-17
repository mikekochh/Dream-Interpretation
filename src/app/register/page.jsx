import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextAuth]/route";
import StarBackground from "@/components/StarBackground";

export default async function Register() {

    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/home");
    }

    return (
        <StarBackground>
            <RegisterForm />
        </StarBackground>
    )
}
