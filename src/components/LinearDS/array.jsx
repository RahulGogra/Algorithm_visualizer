import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header";
import styles from "../../css/Array.module.css";
import SectionNav from "../sectionNav";

const ArrayComponent = () => {
    const [arrayType, setArrayType] = useState("2D");
    const [inputRows, setInputRows] = useState(1);
    const [inputCols, setInputCols] = useState(5);
    const [array, setArray] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const generateArray = () => {
        const newArray = [];
        const rows = parseInt(inputRows);
        const cols = parseInt(inputCols);

        if (arrayType === "1D") {
            for (let i = 0; i < cols; i++) {
                newArray.push({
                    id: `${i}`,
                    distance: Infinity,
                    isVisited: false,
                    previousNode: null,
                });
            }
        } else {
            for (let i = 0; i < rows; i++) {
                const row = [];
                for (let j = 0; j < cols; j++) {
                    row.push({
                        id: `${i}_${j}`,
                        distance: Infinity,
                        isVisited: false,
                        previousNode: null,
                    });
                }
                newArray.push(row);
            }
        }
        return newArray;
    };

    useEffect(() => {
        setArray(generateArray());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputRows, inputCols, arrayType]);

    const markAsVisited = async (rowIndex, colIndex) => {
        if (arrayType === "1D") {
            const newArray = array.map((cell, index) => {
                if (index === colIndex) {
                    return { ...cell, isVisited: !cell.isVisited };
                }
                return cell;
            });
            setArray(newArray);
        } else {
            const newArray = array.map((row, rIdx) =>
                Array.isArray(row)
                    ? row.map((cell, cIdx) => {
                          if (rIdx === rowIndex && cIdx === colIndex) {
                              return { ...cell, isVisited: !cell.isVisited };
                          }
                          return cell;
                      })
                    : row
            );
            setArray(newArray);
        }
        if (localStorage.getItem("userInfo")) {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "http://localhost:5000/user/topic",
                { userID: userInfo.userID, topic: "Array", completed: true },
                config
            );

            console.log("Submitted:", {
                data,
            });
        }
        setSnackbarMessage(
            `Cell at row ${rowIndex}, column ${colIndex} marked as visited`
        );
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    return (
        <>
            <Header />
            <SectionNav />
            <h3>
                Select the array type and enter the number of rows and columns
                to generate an array. You can then mark cells as visited by
                clicking on them.
            </h3>
            <div className={styles.formContainer}>
                <label>
                    Array Type:
                    <select
                        value={arrayType}
                        onChange={(e) => setArrayType(e.target.value)}
                    >
                        <option value="1D">1D</option>
                        <option value="2D">2D</option>
                    </select>
                </label>
                <label>
                    Rows:
                    <input
                        type="number"
                        value={inputRows}
                        onChange={(e) => setInputRows(e.target.value)}
                        disabled={arrayType === "1D"}
                    />
                </label>
                <label>
                    Columns:
                    <input
                        type="number"
                        value={inputCols}
                        onChange={(e) => setInputCols(e.target.value)}
                    />
                </label>
            </div>

            <div className={styles.gridbox}>
                {arrayType === "1D" ? (
                    <div className={styles.gridRow}>
                        {array.map((cell, colIndex) => (
                            <div
                                key={cell.id}
                                className={`${styles.gridCell} ${
                                    cell.isVisited ? styles.visited : ""
                                }`}
                                onClick={() => markAsVisited(0, colIndex)}
                            >
                                {cell.id}
                            </div>
                        ))}
                    </div>
                ) : (
                    array.map((row, rowIndex) => (
                        <div key={rowIndex} className={styles.gridRow}>
                            {Array.isArray(row) &&
                                row.map((cell, colIndex) => (
                                    <div
                                        key={cell.id}
                                        className={`${styles.gridCell} ${
                                            cell.isVisited ? styles.visited : ""
                                        }`}
                                        onClick={() =>
                                            markAsVisited(rowIndex, colIndex)
                                        }
                                    >
                                        {cell.id}
                                    </div>
                                ))}
                        </div>
                    ))
                )}
            </div>
            <div
                className={`${styles.snackbar} ${
                    showSnackbar ? styles.show : ""
                }`}
            >
                {snackbarMessage}
            </div>
        </>
    );
};

export default ArrayComponent;
