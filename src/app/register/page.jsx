import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import StarBackground from "@/components/StarBackground";

export default async function Register() {

    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/interpret");
    }

    return (
        <StarBackground>
            <div>
                <div className="grid place-items-center h-screen">
                    <RegisterForm />
                </div>
            </div>
        </StarBackground>
    )
}
