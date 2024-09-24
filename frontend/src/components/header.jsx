import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
    const location = useLocation();
    const path = location.pathname;
    const navigate = useNavigate();

    // Safely handle localStorage data parsing
    const data = JSON.parse(localStorage.getItem("userInfo")) || {};

    return (
        <div className="header">
            {path !== "/" && (
                <div className="home-button-container">
                    <Link to="/" className="home-button">
                        Home
                    </Link>
                </div>
            )}

            <h1>Algo Visualizer</h1>

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
                            className="login-button"
                        >
                            {data.user}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate("/Auth")}
                        className="login-button"
                    >
                        Login/Register
                    </button>
                )}
            </div>
        </div>
    );
};

export default Header;
