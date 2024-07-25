import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const SelectionSort = () => {
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

    const selectionSort = async () => {
        setIsSorting(true);
        let arr = [...array];

        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[i]) {
                    setSwappingIndices([j]);
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    setArray([...arr]);
                    await new Promise((resolve) => setTimeout(resolve, 10));
                }
            }
            setRound((prevRound) => prevRound + 1); // Increment the round after each iteration
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
                <button onClick={selectionSort} disabled={isSorting}>
                    Selection Sort
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

export default SelectionSort;
