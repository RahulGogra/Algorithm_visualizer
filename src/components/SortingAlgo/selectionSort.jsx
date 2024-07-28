import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const SelectionSort = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [swappingIndices, setSwappingIndices] = useState([-1]);
    const [currentStep, setCurrentStep] = useState("");

    const generateArray = useCallback(() => {
        if (isSorting) return; // Prevent changes during sorting
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

    const selectionSort = async () => {
        setIsSorting(true);
        setCurrentStep("Starting Selection Sort...");
        let arr = [...array];

        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                setSwappingIndices([i, minIndex]);
                setCurrentStep(`Swapping ${arr[i]} and ${arr[minIndex]}`);
                let temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 90));
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        setCurrentStep("Sorting complete!");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSorting(false);
        setSwappingIndices([-1]);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className="theory-section">
                <h2>Selection Sort Algorithm</h2>
                <p>
                    Selection Sort is a simple comparison-based sorting
                    algorithm. The list is divided into two parts: a sorted part
                    and an unsorted part. The smallest element is selected from
                    the unsorted part and swapped with the leftmost element, and
                    that element becomes a part of the sorted part.
                </p>
            </div>
            <div className="binarySearchContainer">
                <div className="controls">
                    <button onClick={generateArray} disabled={isSorting}>
                        Generate New Array
                    </button>
                    <button onClick={selectionSort} disabled={isSorting}>
                        Selection Sort
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
                                2. Click on &quot;Selection Sort&quot; to start
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

export default SelectionSort;
