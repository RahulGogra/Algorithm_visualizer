import React from "react";
import { useState } from "react";
import axios from "axios";
import Header from "../header";
import styles from "../../css/Stack.module.css";
import SectionNav from "../sectionNav";

const Stack = () => {
    const [stack, setStack] = useState([10, 20, 30, 40, 50]);
    const [inputValue, setInputValue] = useState("");
    const [snackbarMessages, setSnackbarMessages] = useState([]);

    const push = async () => {
        if (inputValue !== "") {
            setStack((prevStack) => [...prevStack, inputValue]);
            if (localStorage.getItem("userInfo")) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };
                const { data } = await axios.post(
                    import.meta.env.VITE_topic,
                    {
                        userID: userInfo.userID,
                        topic: "Stack",
                        completed: true,
                    },
                    config
                );

                console.log("Submitted:", {
                    data,
                });
            }
            setInputValue("");
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${inputValue} pushed!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    const pop = () => {
        if (stack.length > 0) {
            const poppedElement = stack.pop();
            setStack([...stack]);
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${poppedElement} popped!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    return (
        <>
            <Header />
            <SectionNav />
            <h3>
                Enter the value to generate a stack of elements (push) Or you
                can perform deletion (pop) on the the elements.
                <br></br>
                It folows First in last out / FILO.
            </h3>
            <div className={styles.stackContainer}>
                <label>
                    Input Value:
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </label>
                <br />
                <button onClick={push}>Push</button>
                <button onClick={pop}>Pop</button>
            </div>
            <div className={styles.stackbox}>
                {stack.map((element, index) => (
                    <div key={index} className={styles.stackelement}>
                        {element}
                    </div>
                ))}
            </div>
            {snackbarMessages.map((message, index) => (
                <div
                    key={index}
                    className={`${styles.snackbar} ${styles.show}`}
                >
                    {message}
                </div>
            ))}
        </>
    );
};

export default Stack;
