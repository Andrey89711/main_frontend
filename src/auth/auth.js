import {
    jwtDecode
} from "jwt-decode";


const TOKEN_KEY = "token";


export function getToken() {

    return localStorage.getItem(TOKEN_KEY);
}


export function setToken(token) {

    localStorage.setItem(TOKEN_KEY, token);
}


export function clearAuth() {

    localStorage.removeItem(TOKEN_KEY);
}


export function getAuthPayload() {

    const token = getToken();

    if (!token) {
        return null;
    }

    try {

        const payload = jwtDecode(token);

        if (!payload.exp) {
            clearAuth();
            return null;
        }

        const expiresAtMs = payload.exp * 1000;

        if (Date.now() >= expiresAtMs) {
            clearAuth();
            return null;
        }

        return payload;

    } catch (error) {
        console.error(error);
        clearAuth();
        return null;
    }
}


export function isAuthenticated() {

    return getAuthPayload() !== null;
}


export function getRole() {

    return getAuthPayload()?.role ?? null;
}


export function getHomePath(role) {

    if (role === "admin") {
        return "/users";
    }

    if (role === "dispatcher") {
        return "/dispatcher";
    }

    if (role === "executor") {
        return "/profile";
    }

    return "/dashboard";
}
