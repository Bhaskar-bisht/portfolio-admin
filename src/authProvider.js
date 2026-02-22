/** @format */

// src/authProvider.js
const API_URL = import.meta.env.VITE_API_URL;

const authProvider = {
    // Called when the user attempts to log in
    login: async ({ username, password }) => {
        try {
            const response = await fetch(`${API_URL}/admin/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            if (data.success && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                return Promise.resolve();
            }

            return Promise.reject(new Error("Invalid credentials"));
        } catch (error) {
            return Promise.reject(error);
        }
    },

    // Called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return Promise.resolve();
    },

    // Called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // Called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
    },

    // Called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        return Promise.resolve(user.role || "user");
    },

    // Get user identity
    getIdentity: () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            return Promise.resolve({
                id: user.id,
                fullName: user.name,
                avatar: user.avatar?.url,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    },
};

export default authProvider;
