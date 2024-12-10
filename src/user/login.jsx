import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            return;
        }
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true,
        };
        const { data } = await axios.post(
            "http://localhost:5000/user/login",
            { email, password },
            config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));

        console.log("Submitted:", {
            email,
            password,
            data,
        });

        navigate("/");

        // Clear form fields
        setEmail("");
        setPassword("");
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                ></input>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                ></input>
                <button type="submit" name="login">
                    Login
                </button>
            </form>
        </>
    );
};

export default Login;
