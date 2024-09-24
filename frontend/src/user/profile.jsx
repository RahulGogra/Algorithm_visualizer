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

        axios
            .get("http://localhost:5000/user/progress")
            .then((response) => {
                setProgress(response.topic); // Set the received data to the state
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userInfo"); // Clear the user info from localStorage
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
                                            <p>{item.userID}</p>
                                        </li>
                                    ))}
                                </ul>

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
