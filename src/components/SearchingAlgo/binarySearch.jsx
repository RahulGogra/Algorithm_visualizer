import React from "react";
import Header from "../header";
import { useState, useCallback, useEffect } from "react";
import SectionNav from "../sectionNav";
import styles from "../../css/binarySearch.module.css"; // Import CSS for styling

const BinarySearch = () => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const binarySearch = async (arr, lower, upper, val) => {
        while (upper >= lower) {
            const mid = lower + Math.floor((upper - lower) / 2);
            setSwappingIndex(mid);
            setCurrentStep(
                `Checking middle index ${mid} with value ${arr[mid]}`
            );
            setSteps((prevSteps) => [
                ...prevSteps,
                `Checking middle index ${mid} with value ${arr[mid]}`,
            ]);
            await new Promise((resolve) => setTimeout(resolve, 3000));

            if (arr[mid] === val) {
                setCurrentStep(`Found value ${val} at index ${mid}`);
                setSteps((prevSteps) => [
                    ...prevSteps,
                    `Found value ${val} at index ${mid}`,
                ]);
                await new Promise((resolve) => setTimeout(resolve, 5000));
                return mid;
            }

            if (arr[mid] > val) {
                setCurrentStep(
                    `Value ${val} is less than ${
                        arr[mid]
                    }. Updating upper bound to ${mid - 1}`
                );
                setSteps((prevSteps) => [
                    ...prevSteps,
                    `Value ${val} is less than ${
                        arr[mid]
                    }. Updating upper bound to ${mid - 1}`,
                ]);
                upper = mid - 1;
            } else {
                setCurrentStep(
                    `Value ${val} is greater than ${
                        arr[mid]
                    }. Updating lower bound to ${mid + 1}`
                );
                setSteps((prevSteps) => [
                    ...prevSteps,
                    `Value ${val} is greater than ${
                        arr[mid]
                    }. Updating lower bound to ${mid + 1}`,
                ]);
                lower = mid + 1;
            }
        }
        setCurrentStep(`Value ${val} not found in the array`);
        setSteps((prevSteps) => [
            ...prevSteps,
            `Value ${val} not found in the array`,
        ]);
        return -1;
    };

    const binarySearchAlgo = async () => {
        if (isNaN(input) || input === "") {
            alert("Please enter a valid number.");
            return;
        }
        setIsSearching(true);
        const sortedArray = array.slice().sort((a, b) => a - b);
        console.log("Sorted Array: ", sortedArray);
        setArray(sortedArray);
        setCurrentStep("Sorting the array...");
        setSteps(["Sorting the array..."]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const val = parseInt(input, 10);
        const result = await binarySearch(
            sortedArray,
            0,
            sortedArray.length - 1,
            val
        );
        setSwappingIndex(result);
        setIsSearching(false);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className={styles.binarySearchContainer}>
                <div>
                    <h1>Binary Search Algorithm Visualizer</h1>
                    <p>
                        Binary search is a fast search algorithm with a time
                        complexity of O(log n). This algorithm works on the
                        principle of divide and conquer. It is crucial that the
                        array is sorted before performing a binary search.
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
                    <button onClick={binarySearchAlgo} disabled={isSearching}>
                        Binary Search
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

export default BinarySearch;
