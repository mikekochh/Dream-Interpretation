import Link from "next/link";

export default function Login() {
    return (
        <div className='text-white grid place-items-center h-screen'>
            <div className="p-5 rounded-lg border-t-4 border-white-400 border">
                <h1 className="text-xl font-bold my-4">Enter the details</h1>
                <form className="flex flex-col gap-3">
                    <input type="text" placeholder="Email" className="LoginInput rounded-lg text-black" />
                    <input type="password" placeholder="Password" className="LoginInput rounded-lg text-black" />
                    <button className="bg-blue-500 rounded-lg py-2 text-white font-bold">Login</button>
                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        Error Message
                    </div>
                    <Link href={'/register'} className="text-sm mt-3 text-right">
                        Don't have an account? <span className="underline">Register</span>
                    </Link>
                </form>
            </div>
        </div>
    )
}