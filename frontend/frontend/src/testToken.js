import axiosInstance from "./axiosInstance"; // your existing axios file

const testToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ No token found in localStorage.");
        return;
    }

    console.log("🛠 Token found:", token);

    try {
        const res = await axiosInstance.get("/auth/verify"); 
        // Replace "/auth/verify" with your backend's token verification endpoint
        console.log("✅ Token is valid:", res.data);
    } catch (error) {
        if (error.response) {
            console.error("❌ Token invalid or expired:", error.response.data);
        } else {
            console.error("⚠ Error checking token:", error.message);
        }
    }
};

testToken();
