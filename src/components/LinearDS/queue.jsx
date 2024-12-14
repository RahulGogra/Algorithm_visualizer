import React from "react";
import { useState } from "react";
import axios from "axios";
import Header from "../header";
import styles from "../../css/Queue.module.css";
import SectionNav from "../sectionNav";

const Queue = () => {
    const [queue, setQueue] = useState([10, 20, 30, 40, 50]);
    const [inputValue, setInputValue] = useState("");
    const [snackbarMessages, setSnackbarMessages] = useState([]);

    const enqueue = async () => {
        if (inputValue !== "") {
            setQueue((prevQueue) => [...prevQueue, inputValue]);
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
                        topic: "Queue",
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
                `Element ${inputValue} enqueued!`,
            ]);
            setTimeout(() => {
                setSnackbarMessages((prevMessages) => prevMessages.slice(1));
            }, 3000);
        }
    };

    const dequeue = () => {
        if (queue.length > 0) {
            const dequeuedElement = queue.shift();
            setQueue([...queue]);
            setSnackbarMessages((prevMessages) => [
                ...prevMessages,
                `Element ${dequeuedElement} dequeued!`,
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
                Enter the value to generate a queue an element Or you can
                perform dequeue on the the elements.
                <br></br>
                It folows First in First out / FIFO.
            </h3>
            <div className={styles.queueContainer}>
                <label>
                    Input Value:
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </label>
                <br />
                <button onClick={enqueue}>Enqueue</button>
                <button onClick={dequeue}>Dequeue</button>
            </div>
            <div className={styles.queuebox}>
                {queue.map((element, index) => (
                    <div key={index} className={styles.queueelement}>
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

export default Queue;
