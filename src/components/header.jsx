import { Link } from "react-router-dom";
import "../css/Header.css";
const Header = () => {
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
};

export default Header;
