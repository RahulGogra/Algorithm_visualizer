import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const InsertionSort = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [round, setRound] = useState(0); // Add a state to keep track of the current round
    const [swappingIndices, setSwappingIndices] = useState([-1]);

    const generateArray = useCallback(() => {
        if (isSorting) return; // Prevent changes during sorting
        const newArray = Array.from(
            { length: 50 },
            () => Math.floor(Math.random() * 400) + 10
        );
        setArray(newArray);
    }, [isSorting, setArray]);

    useEffect(() => {
        generateArray();
        setRound(0);
    }, [generateArray]);

    const insertionSort = async () => {
        setIsSorting(true);
        let arr = [...array];

        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && key < arr[j]) {
                setSwappingIndices([j]);
                arr[j + 1] = arr[j];
                j--;
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 20));
            }
            arr[j + 1] = key;
            setRound((prevRound) => prevRound + 1);
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSorting(false);
        setSwappingIndices([-1]);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className="sorting-visualizer">
                <button onClick={generateArray} disabled={isSorting}>
                    Generate New Array
                </button>
                <button onClick={insertionSort} disabled={isSorting}>
                    Insertion Sort
                </button>
                <div className="array-container">
                    {array.map((value, index) => (
                        <div
                            key={index}
                            className={`array-bar ${
                                swappingIndices.includes(index)
                                    ? "swapping"
                                    : ""
                            }`}
                            style={{ height: `${value}px` }}
                        ></div>
                    ))}
                </div>
                <p>Round: {round}</p>
            </div>
        </>
    );
};

export default InsertionSort;
