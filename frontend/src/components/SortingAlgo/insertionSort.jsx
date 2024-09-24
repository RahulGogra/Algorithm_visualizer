import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const InsertionSort = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [swappingIndices, setSwappingIndices] = useState([-1]);
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

    const insertionSort = async () => {
        setIsSorting(true);
        setCurrentStep("Starting Insertion Sort...");
        let arr = [...array];

        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && key < arr[j]) {
                setSwappingIndices([j]);
                setCurrentStep(`Swapping ${arr[j + 1]} and ${arr[j]}`);
                arr[j + 1] = arr[j];
                j--;
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 90));
            }
            arr[j + 1] = key;
            setCurrentStep(`Inserting ${key} at position ${j + 1}`);
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
                <h2>Insertion Sort Algorithm</h2>
                <p>
                    Insertion Sort is a simple sorting algorithm that builds the
                    final sorted array one item at a time. It is much less
                    efficient on large lists than more advanced algorithms such
                    as quicksort, heapsort, or merge sort.
                </p>
            </div>
            <div className="binarySearchContainer">
                <div className="controls">
                    <button onClick={generateArray} disabled={isSorting}>
                        Generate New Array
                    </button>
                    <button onClick={insertionSort} disabled={isSorting}>
                        Insertion Sort
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
                                2. Click on &quot;Insertion Sort&quot; to start
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

export default InsertionSort;
