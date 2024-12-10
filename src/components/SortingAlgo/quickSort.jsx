import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const QuickSort = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [swappingIndices, setSwappingIndices] = useState([-1, -1]);
    const [currentStep, setCurrentStep] = useState("");

    const generateArray = useCallback(() => {
        if (isSorting) return;
        const newArray = Array.from(
            { length: 30 },
            () => Math.floor(Math.random() * 400) + 10
        );
        setArray(newArray);
        setCurrentStep("");
    }, [isSorting]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    const partition = async (arr, low, high) => {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            if (arr[j] < pivot) {
                i++;
                setSwappingIndices([i, j]);
                setCurrentStep(`Swapping indices ${i} and ${j}`);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }
        setSwappingIndices([i + 1, high]);
        setCurrentStep(`Swapping indices ${i + 1} and ${high}`);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        setArray([...arr]);
        await new Promise((resolve) => setTimeout(resolve, 50));
        return i + 1;
    };

    const quickSort = async (arr, low, high) => {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
    };

    const quickSortAlgo = async () => {
        setIsSorting(true);
        setCurrentStep("Starting Quick Sort...");
        let arrCopy = [...array];
        await quickSort(arrCopy, 0, arrCopy.length - 1);
        setCurrentStep("Sorting complete!");
        if (localStorage.getItem("userInfo")) {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "http://localhost:5000/user/topic",
                {
                    userID: userInfo.userID,
                    topic: "QuickSort",
                    completed: true,
                },
                config
            );

            console.log("Submitted:", {
                data,
            });
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSorting(false);
        setSwappingIndices([-1, -1]);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className="theory-section">
                <h2>Quick Sort Algorithm</h2>
                <p>
                    Quick Sort is a highly efficient sorting algorithm and is
                    based on partitioning of array of data into smaller arrays.
                    A large array is partitioned into two arrays one of which
                    holds values smaller than the specified value, say pivot,
                    based on which the partition is made and another array holds
                    values greater than the pivot value.
                </p>
            </div>
            <div className="binarySearchContainer">
                <div className="controls">
                    <button onClick={generateArray} disabled={isSorting}>
                        Generate New Array
                    </button>
                    <button onClick={quickSortAlgo} disabled={isSorting}>
                        Quick Sort
                    </button>
                </div>
                <div className="visualization-container">
                    <div className="arrayContainer">
                        {array.map((value, index) => (
                            <div
                                key={index}
                                className={`arrayBar ${
                                    swappingIndices.includes(index)
                                        ? "swapping"
                                        : ""
                                }`}
                                style={{ height: `${value}px` }}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                    <div className="stepsContainer">
                        <h3>Steps</h3>
                        <p>{currentStep}</p>
                        <ul>
                            <li>1. Generate a new array.</li>
                            <li>
                                2. Click on &quot;Quick Sort&quot; to start
                                sorting.
                            </li>
                            <li>3. Watch the sorting process.</li>
                            <li>4. The steps will be displayed here.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuickSort;
