import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); //new state to track loading

    useEffect(() => {
        if (user) return;

        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                const token = localStorage.getItem("token");
                setUser({ ...response.data, token });
            } catch (error) {
                console.error("User not authentication", error);
                clearUser();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
        // eslint-disable-next-line
    }, []);

    const updateUser = (userData) => {
        console.log("updateUser called with:", userData);
        setUser(userData);
        localStorage.setItem("token", userData.token); //save token
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
