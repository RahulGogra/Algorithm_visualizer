import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const MergeSort = () => {
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

    async function merge(arr, start, end) {
        if (start >= end) {
            return;
        }

        let mid = Math.floor((start + end) / 2);

        let len1 = mid - start + 1;
        let len2 = end - mid;

        let first = new Array(len1);
        let second = new Array(len2);

        let k = start;
        for (let i = 0; i < len1; i++) {
            first[i] = arr[k++];
        }

        k = mid + 1;
        for (let i = 0; i < len2; i++) {
            second[i] = arr[k++];
        }

        let index1 = 0,
            index2 = 0;
        k = start;
        while (index1 < len1 && index2 < len2) {
            if (first[index1] < second[index2]) {
                setSwappingIndices([k, index1]);
                setCurrentStep(`Merging indices ${k} and ${index1}`);
                arr[k++] = first[index1++];
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 90));
            } else {
                setSwappingIndices([k, index2]);
                setCurrentStep(`Merging indices ${k} and ${index2}`);
                arr[k++] = second[index2++];
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 90));
            }
        }
        while (index1 < len1) {
            setSwappingIndices([k, index1]);
            setCurrentStep(`Merging remaining indices ${k} and ${index1}`);
            arr[k++] = first[index1++];
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 90));
        }
        while (index2 < len2) {
            setSwappingIndices([k, index2]);
            setCurrentStep(`Merging remaining indices ${k} and ${index2}`);
            arr[k++] = second[index2++];
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 90));
        }
    }

    async function mergeSort(arr, start, end) {
        if (start >= end) {
            return;
        }

        let mid = Math.floor((start + end) / 2);

        await mergeSort(arr, start, mid);
        await mergeSort(arr, mid + 1, end);

        await merge(arr, start, end);
    }

    const mergeSortAlgo = async () => {
        setIsSorting(true);
        setCurrentStep("Starting Merge Sort...");
        let arrCopy = [...array];
        await mergeSort(arrCopy, 0, arrCopy.length - 1);
        setCurrentStep("Sorting complete!");
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
                    topic: "MergeSort",
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
                <h2>Merge Sort Algorithm</h2>
                <p>
                    Merge Sort is an efficient, stable, comparison-based, divide
                    and conquer sorting algorithm. Most implementations produce
                    a stable sort, meaning that the implementation preserves the
                    input order of equal elements in the sorted output.
                </p>
            </div>
            <div className="binarySearchContainer">
                <div className="controls">
                    <button onClick={generateArray} disabled={isSorting}>
                        Generate New Array
                    </button>
                    <button onClick={mergeSortAlgo} disabled={isSorting}>
                        Merge Sort
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
                                2. Click on &quot;Merge Sort&quot; to start
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

export default MergeSort;
