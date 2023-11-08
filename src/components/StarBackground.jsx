import React from "react";

const StarBackground = ({ children }) => {
    return (
        <div className="star-background">
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
        </div>
    )
}

export default StarBackground;