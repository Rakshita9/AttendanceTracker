import axios from "axios";

const API_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : (process.env.REACT_APP_BACKEND_URL || "http://localhost:5000");

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
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
