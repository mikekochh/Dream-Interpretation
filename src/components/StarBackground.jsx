import React from "react";
import { useRouter } from "next/navigation";

const StarBackground = ({ children }) => {

    const router = useRouter();

    const privacyNotice = () => {
        router.push("/privacyNotice");
    }

    return (
        <div className="star-background relative">
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            <span className="shooting-star"></span>
            {children}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-white text-center">
                <button onClick={privacyNotice}>Privacy Notice</button>
            </div>
        </div>
    )
}

export default StarBackground;