export const getCorsOptions = () => {
    const allowedOrigins = [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "http://localhost:3000",
        "http://localhost:5000",
        "https://localhost:3000",
    ];

    return {
        origin: (origin, callback) => {
            if (
                !origin ||
                origin.includes("localhost") ||
                origin.includes("127.0.0.1") ||
                origin.includes(".vercel.app") ||
                allowedOrigins.includes(origin)
            ) {
                callback(null, true);
            } else {
                console.log("CORS blocked:", origin);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    };
};
