import RegisterForm from "@/components/RegisterForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import StarBackground from "@/components/StarBackground";
import ContactAndPrivacyButtons from "@/components/ContactAndPrivacyButtons";

export default async function Register() {

    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/journal");
    }

    return (
        <StarBackground>
            <div>
                <div className="grid place-items-center h-screen">
                    <RegisterForm />
                </div>
                <ContactAndPrivacyButtons />
            </div>
        </StarBackground>
    )
}
