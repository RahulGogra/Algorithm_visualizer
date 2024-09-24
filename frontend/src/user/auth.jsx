import { useState } from "react";
import LoginForm from "../user/login";
import RegisterForm from "../user/register";
import Header from "../components/header";

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <>
            <Header />

            <div className="auth-container">
                <div className="form-switch">
                    <h2>{isLogin ? "Login" : "Register"}</h2>
                    <button onClick={toggleForm}>
                        {isLogin ? "Go to Register" : "Go to Login"}
                    </button>
                </div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </>
    );
};

export default Auth;
