import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const QuickSort = () => {
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

    async function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            if (arr[j] < pivot) {
                i++;
                setSwappingIndices([i, j]); // Update swapping indices
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                setArray([...arr]); // Update the array state
                await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for visualization
            }
        }
        setSwappingIndices([i + 1, high]); // Update swapping indices
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        setArray([...arr]); // Update the array state
        await new Promise((resolve) => setTimeout(resolve, 50)); // Delay for visualization
        setRound((prevRound) => prevRound + 1);
        return i + 1;
    }

    let arr = [...array];

    async function quickSort(arr, low, high) {
        if (low < high) {
            let pi = await partition(arr, low, high);
            await quickSort(arr, low, pi - 1);
            await quickSort(arr, pi + 1, high);
        }
    }

    async function quickSortAlgo() {
        setIsSorting(true);
        await quickSort(arr, 0, arr.length - 1);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSorting(false);
        setSwappingIndices([-1]);
    }

    return (
        <>
            <Header />
            <SectionNav />
            <div className="sorting-visualizer">
                <button onClick={generateArray} disabled={isSorting}>
                    Generate New Array
                </button>
                <button onClick={quickSortAlgo} disabled={isSorting}>
                    Quick Sort
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

export default QuickSort;
