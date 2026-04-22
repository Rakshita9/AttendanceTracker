import axios from "axios";

const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const API_URL = isLocalhost ? "http://localhost:5000" : (process.env.REACT_APP_BACKEND_URL || "");

const apiError = () => new Error(
    "REACT_APP_BACKEND_URL is missing. Set it in Vercel to your backend API URL and redeploy the frontend."
);

const api = axios.create({
    baseURL: API_URL || undefined,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    if (!isLocalhost && !API_URL) {
        return Promise.reject(apiError());
    }

    return config;
});

export const signup = async (email, password) => {
    return api.post("/signup", { email, password });
};

export const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const fetchSubjects = async () => {
    const token = localStorage.getItem("token");
    return api.get("/subject", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const addSubject = async (name) => {
    const token = localStorage.getItem("token");
    return api.post(
        "/subject",
        { name },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const deleteSubject = async (name) => {
    const token = localStorage.getItem("token");
    return api.delete(`/subjects/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const saveAttendance = async (subject, date, status) => {
    const token = localStorage.getItem("token");
    return api.post(
        "/attendance",
        { subject, date, status },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

export const deleteAttendance = async (subject, date) => {
    const token = localStorage.getItem("token");
    return api.delete("/attendance", {
        data: { subject, date },
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const fetchAttendance = async () => {
    const token = localStorage.getItem("token");
    return api.get("/attendance", {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const requestPasswordReset = async (email) => {
    return api.post("/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
    return api.post("/reset-password", { token, newPassword });
};
