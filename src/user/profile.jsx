import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState({ username: "", email: "", userID: "" });
    const [progress, setProgress] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Get the user info from localStorage
        const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

        // If user info exists, set it in state
        if (storedUserInfo) {
            setUser({
                username: storedUserInfo.user,
                email: storedUserInfo.email,
                userID: storedUserInfo.userID,
            });
        }
    }, []);

    const fetchProgress = async () => {
        try {
            // Make a GET request to /user/progress
            const response = await axios.get(import.meta.env.VITE_progress, {
                params: {
                    userID: user.userID,
                },
                withCredentials: true, // Important to include cookies with the request
            });
            setProgress(response.data.topics || []);
            // Handle the response
            console.log(response.data); // This will give you the user's progress data
        } catch (error) {
            console.error(
                "Error fetching progress:",
                error.response?.data || error.message
            );
        }
    };

    const handleLogout = async () => {
        localStorage.clear();
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true,
        };
        const { data } = await axios.post(import.meta.env.VITE_logout, config);
        console.log(data);
        navigate("/"); // Redirect to the login or home page
    };

    return (
        <>
            <Header />
            <div className="profile-page">
                <div className="profile-container">
                    <div className="profile-header">
                        <img
                            src="userProfile.png"
                            alt="Profile"
                            className="profile-image"
                            height="150px"
                        />
                        <h1>
                            {user.username
                                ? `Welcome, ${user.username}!`
                                : "User Profile"}
                        </h1>
                    </div>

                    <div className="profile-details">
                        {user.username ? (
                            <>
                                <p>
                                    <strong>Username:</strong> {user.username}
                                </p>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <h1>Progress List</h1>
                                <ul>
                                    {progress.map((item) => (
                                        <li key={item._id}>
                                            <h3>{item.topic}</h3>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={fetchProgress}
                                    className="logout-button"
                                >
                                    Progress
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="logout-button"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <p>No user is logged in.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
