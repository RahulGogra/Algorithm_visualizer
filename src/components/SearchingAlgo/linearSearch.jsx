import Header from "../header";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import SectionNav from "../sectionNav";
import styles from "../../css/linearSearch.module.css"; // Import CSS for styling

const LinearSearch = () => {
    const [array, setArray] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [input, setInput] = useState("");
    const [swappingIndex, setSwappingIndex] = useState(-1);
    // eslint-disable-next-line no-unused-vars
    const [currentStep, setCurrentStep] = useState("");
    const [steps, setSteps] = useState([]);

    const generateArray = useCallback(() => {
        if (isSearching) return;
        const newArray = Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 400) + 10
        );
        console.log("Generated Array: ", newArray);
        setArray(newArray);
        setSwappingIndex(-1);
        setSteps([]);
        setCurrentStep("");
    }, [isSearching]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    const linearSearch = async (arr, lower, upper, val) => {
        while (upper >= lower) {
            setSwappingIndex(lower);
            setCurrentStep(`Checking index ${lower} with value ${arr[lower]}`);
            setSteps((prevSteps) => [
                ...prevSteps,
                `Checking index ${lower} with value ${arr[lower]}`,
            ]);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (arr[lower] === val) {
                setCurrentStep(`Found value ${val} at index ${lower}`);
                setSteps((prevSteps) => [
                    ...prevSteps,
                    `Found value ${val} at index ${lower}`,
                ]);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return lower;
            }
            lower++;
        }
        setCurrentStep(`Value ${val} not found in the array`);
        setSteps((prevSteps) => [
            ...prevSteps,
            `Value ${val} not found in the array`,
        ]);
        return -1;
    };

    const linearSearchAlgo = async () => {
        if (isNaN(input) || input === "") {
            alert("Please enter a valid number.");
            return;
        }
        setIsSearching(true);
        const val = parseInt(input, 10);
        const result = await linearSearch(array, 0, array.length - 1, val);
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
                    topic: "LinearSearch",
                    completed: true,
                },
                config
            );

            console.log("Submitted:", {
                data,
            });
        }
        setSwappingIndex(result);
        setIsSearching(false);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className={styles.linearSearchContainer}>
                <div>
                    <h1>Linear Search Algorithm Visualizer</h1>
                    <p>
                        Linear search is a simple search algorithm with a time
                        complexity of O(n). This algorithm works by sequentially
                        checking each element of the list until a match is found
                        or the whole list has been searched.
                    </p>
                    <button onClick={generateArray} disabled={isSearching}>
                        Generate New Array
                    </button>
                    <input
                        type="number"
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Search the Number"
                        style={{ height: "24px" }}
                        disabled={isSearching}
                    ></input>
                    <button onClick={linearSearchAlgo} disabled={isSearching}>
                        Linear Search
                    </button>

                    <div className={styles.arrayContainer}>
                        {array.map((value, index) => (
                            <div
                                key={index}
                                className={`${styles.arrayBar} ${
                                    swappingIndex === index
                                        ? styles.swapping
                                        : ""
                                }`}
                                style={{
                                    height: `${value}px`,
                                    width: `30px`,
                                }}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.stepsContainer}>
                    <h2>Steps:</h2>
                    <ul>
                        {steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default LinearSearch;
