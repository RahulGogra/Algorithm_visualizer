import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const BubbleSort = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [round, setRound] = useState(0);
    const [swappingIndices, setSwappingIndices] = useState([-1, -1]); // New state to keep track of swapping indices
    const [currentStep, setCurrentStep] = useState("");

    const generateArray = useCallback(() => {
        if (isSorting) return; // Prevent changes during sorting
        const newArray = Array.from(
            { length: 50 },
            () => Math.floor(Math.random() * 400) + 10
        );
        setArray(newArray);
        setRound(0);
        setCurrentStep("");
    }, [isSorting, setArray]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    const bubbleSort = async () => {
        setIsSorting(true);
        setCurrentStep("Starting Bubble Sort...");
        let arr = [...array];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    setSwappingIndices([j, j + 1]); // Update swapping indices
                    setCurrentStep(`Swapping indices ${j} and ${j + 1}`);
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    setArray([...arr]);
                    await new Promise((resolve) => setTimeout(resolve, 90)); // Delay for visualization
                }
            }
            setRound((prevRound) => prevRound + 1); // Increment the round after each iteration
            await new Promise((resolve) => setTimeout(resolve, 500)); // Add an interval after one round is complete
        }
        setCurrentStep("Sorting complete!");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSorting(false);
        setSwappingIndices([-1, -1]); // Reset swapping indices after sorting is complete
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className="theory-section">
                <h2>Bubble Sort Algorithm</h2>
                <p>
                    Bubble Sort is a simple sorting algorithm that repeatedly
                    steps through the list, compares adjacent elements and swaps
                    them if they are in the wrong order. The pass through the
                    list is repeated until the list is sorted. The algorithm
                    gets its name from the way smaller elements
                    &quot;bubble&quot; to the top of the list.
                </p>
            </div>
            <div className="binarySearchContainer">
                <div className="controls">
                    <button onClick={generateArray} disabled={isSorting}>
                        Generate New Array
                    </button>
                    <button onClick={bubbleSort} disabled={isSorting}>
                        Bubble Sort
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
                                2. Click on &quot;Bubble Sort&quot; to start
                                sorting.
                            </li>
                            <li>3. Watch the sorting process.</li>
                            <li>4. The steps will be displayed here.</li>
                        </ul>
                    </div>
                </div>
                <p>Round: {round}</p>
            </div>
        </>
    );
};

export default BubbleSort;
