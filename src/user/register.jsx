import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!username || !email || !password) {
            return;
        }
        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true,
        };
        const { data } = await axios.post(
            import.meta.env.VITE_register,
            { username, email, password },
            config
        );

        localStorage.setItem("userInfo", JSON.stringify(data));

        console.log("Submitted:", {
            username,
            password,
            data,
        });

        navigate("/");

        // Clear form fields
        setUsername("");
        setEmail("");
        setPassword("");
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                ></input>
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
                    Register
                </button>
            </form>
        </>
    );
};

export default Register;
