import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "../css/Header.module.css";

const Header = () => {
    const location = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();

    // Safely handle localStorage data parsing
    const data = JSON.parse(localStorage.getItem("userInfo")) || {};
    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        // Apply saved theme from localStorage
        const savedTheme = localStorage.getItem("theme") || "dark";
        setTheme(savedTheme);
        document.documentElement.classList.toggle(
            "light-theme",
            savedTheme === "light"
        );
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle(
            "light-theme",
            newTheme === "light"
        );
    };
    return (
        <div className={styles.header}>
            {path !== "/" && (
                <div className={styles.homeButtonContainer}>
                    <Link to="/" className={styles.homeButton}>
                        Home
                    </Link>
                </div>
            )}

            <h1>Algo Visualizer</h1>

            <div>
                <button onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

            <div>
                {data.user ? (
                    <>
                        <div>
                            <img
                                src="/userProfile.png"
                                alt="Profile"
                                height="40px"
                            />
                        </div>
                        <button
                            onClick={() => navigate("/Profile")}
                            className={styles.loginButton}
                        >
                            {data.user}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate("/Auth")}
                        className={styles.loginButton}
                    >
                        Login/Register
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
