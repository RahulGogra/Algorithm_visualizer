import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";
const Header = () => {
    const location = useLocation();
    const path = location.pathname;

    if (path === "/") {
        return (
            <>
                <div className="header">
                    <h1>Algo Visualizer</h1>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="header">
                    <div className="home-button-container">
                        <Link to="/" className="home-button">
                            Home
                        </Link>
                    </div>
                    <h1>Algo Visualizer</h1>
                </div>
            </>
        );
    }
};

export default Header;
