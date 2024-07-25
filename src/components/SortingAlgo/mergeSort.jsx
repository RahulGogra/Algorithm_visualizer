import { useState, useEffect, useCallback } from "react";
import "../../css/bubbleSort.css";
import Header from "../header";
import SectionNav from "../sectionNav";

const MergeSort = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [round, setRound] = useState(0);
    const [swappingIndices, setSwappingIndices] = useState([-1, -1]);

    const generateArray = useCallback(() => {
        if (isSorting) return;
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
                arr[k++] = first[index1++];
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 90));
            } else {
                setSwappingIndices([k, index2]);
                arr[k++] = second[index2++];
                setArray([...arr]);
                await new Promise((resolve) => setTimeout(resolve, 90));
            }
        }
        while (index1 < len1) {
            setSwappingIndices([k, index1]);
            arr[k++] = first[index1++];
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 90));
        }
        while (index2 < len2) {
            setSwappingIndices([k, index2]);
            arr[k++] = second[index2++];
            setArray([...arr]);
            await new Promise((resolve) => setTimeout(resolve, 90));
        }
        setRound((prevRound) => prevRound + 1);
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
        let arr = [...array];
        await mergeSort(arr, 0, arr.length - 1);
        setArray(arr);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSorting(false);
        setSwappingIndices([-1, -1]);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className="sorting-visualizer">
                <button onClick={generateArray} disabled={isSorting}>
                    Generate New Array
                </button>
                <button onClick={mergeSortAlgo} disabled={isSorting}>
                    Merge Sort
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

export default MergeSort;
