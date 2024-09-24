import Header from "../header";
import { useState, useEffect } from "react";
import "../../css/grid.css";
import SectionNav from "../sectionNav";

const Dijkstra = () => {
    const [rows] = useState(20); // Number of rows
    const [cols] = useState(20); // Number of columns
    const [grid, setGrid] = useState([]);
    const [inputMode, setInputMode] = useState("Set Start"); // Modes: Set Start, Set End, Add Wall, Add Weight
    const [state, setState] = useState({
        start: "",
        end: "",
        walls: [],
        weights: [],
        path: [],
        visitedNodes: [],
        isSearching: false,
    });
    const [currentStep, setCurrentStep] = useState("");

    // Function to generate a new grid based on rows and cols
    const generateGrid = () => {
        const newGrid = [];
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
            newGrid.push(row);
        }
        return newGrid;
    };

    // Initialize the grid on component mount
    useEffect(() => {
        setGrid(generateGrid());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, cols]);

    // Function to handle grid cell click
    const handleCellClick = (rowIndex, colIndex) => {
        if (state.isSearching) return; // Prevent interaction while searching
        const cellId = `${rowIndex}_${colIndex}`;

        setState((prevState) => {
            switch (inputMode) {
                case "Set Start":
                    return { ...prevState, start: cellId };
                case "Set End":
                    if (cellId !== prevState.start) {
                        return { ...prevState, end: cellId };
                    }
                    break;
                case "Add Wall":
                    if (
                        cellId !== prevState.start &&
                        cellId !== prevState.end
                    ) {
                        const walls = prevState.walls.includes(cellId)
                            ? prevState.walls.filter((id) => id !== cellId)
                            : [...prevState.walls, cellId];
                        return { ...prevState, walls };
                    }
                    break;
                case "Add Weight":
                    if (
                        cellId !== prevState.start &&
                        cellId !== prevState.end
                    ) {
                        const weights = prevState.weights.includes(cellId)
                            ? prevState.weights.filter((id) => id !== cellId)
                            : [...prevState.weights, cellId];
                        return { ...prevState, weights };
                    }
                    break;
                default:
                    return prevState;
            }
            return prevState;
        });
    };

    // Handle clearing the grid and resetting states
    const handleClear = () => {
        if (state.isSearching) return; // Prevent clearing while searching
        setState({
            start: "",
            end: "",
            walls: [],
            weights: [],
            path: [],
            visitedNodes: [],
            isSearching: false,
        });
        setGrid(generateGrid());
        setCurrentStep("");
    };

    // Get neighbors of the current node
    const getNeighbors = (grid, node) => {
        const [row, col] = node.id.split("_").map(Number);
        const neighbors = [];
        if (row > 0) neighbors.push(grid[row - 1][col]);
        if (row < rows - 1) neighbors.push(grid[row + 1][col]);
        if (col > 0) neighbors.push(grid[row][col - 1]);
        if (col < cols - 1) neighbors.push(grid[row][col + 1]);
        return neighbors.filter(
            (neighbor) =>
                !neighbor.isVisited && !state.walls.includes(neighbor.id)
        );
    };

    // Dijkstra's algorithm implementation
    const dijkstra = async () => {
        if (state.isSearching || !state.start || !state.end || !grid.length)
            return;

        setState((prevState) => ({ ...prevState, isSearching: true }));
        setCurrentStep("Initializing start and end nodes...");
        const startNode = grid.flat().find((cell) => cell.id === state.start);
        const endNode = grid.flat().find((cell) => cell.id === state.end);

        startNode.distance = 0;

        const unvisitedNodes = [...grid.flat()];

        while (unvisitedNodes.length) {
            unvisitedNodes.sort((a, b) => a.distance - b.distance);
            const closestNode = unvisitedNodes.shift();

            if (closestNode.distance === Infinity) break;
            if (closestNode.id === endNode.id) break;

            closestNode.isVisited = true;
            setState((prevState) => ({
                ...prevState,
                visitedNodes: [...prevState.visitedNodes, closestNode],
            }));

            const neighbors = getNeighbors(grid, closestNode);

            for (const neighbor of neighbors) {
                const weight = state.weights.includes(neighbor.id) ? 7 : 1; // Example weight: 7 times the distance for weighted cells
                const alt = closestNode.distance + weight;
                if (alt < neighbor.distance) {
                    neighbor.distance = alt;
                    neighbor.previousNode = closestNode;
                }
            }

            await new Promise((r) => setTimeout(r, 50));
            setGrid((prevGrid) => [...prevGrid]); // Trigger re-render
            setCurrentStep(`Visiting node ${closestNode.id}...`);
        }

        const newPath = [];
        let currentNode = endNode;

        while (currentNode) {
            newPath.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }

        setState((prevState) => ({
            ...prevState,
            path: newPath,
            isSearching: false,
        }));
        setCurrentStep("Path found!");
    };

    return (
        <>
            <Header />
            <SectionNav />
            <div className="theory-section">
                <h2>Dijkstra&apos;s Algorithm</h2>
                <p>
                    Dijkstra&apos;s algorithm is a famous algorithm used for
                    finding the shortest paths between nodes in a graph. It was
                    conceived by computer scientist Edsger W. Dijkstra in 1956
                    and published three years later. The algorithm works by
                    iteratively selecting the node with the smallest known
                    distance and updating the paths to its neighbors. It
                    continues until it finds the shortest path to the target
                    node or all nodes have been visited.
                </p>
            </div>
            <div className="grid-box">
                <div className="instructions">
                    <h3>Instructions</h3>
                    <p>Select mode:</p>
                    <ul>
                        <li>Set Start: Select the start node</li>
                        <li>Set End: Select the end node</li>
                        <li>Add Wall: Add walls to block paths</li>
                        <li>Add Weight: Add weights to increase path cost</li>
                    </ul>
                    <button onClick={handleClear} disabled={state.isSearching}>
                        Clear All
                    </button>
                    <div className="select-wrapper">
                        <select
                            onChange={(e) => setInputMode(e.target.value)}
                            disabled={state.isSearching}
                        >
                            <option value="Set Start">Set Start</option>
                            <option value="Set End">Set End</option>
                            <option value="Add Wall">Add Wall</option>
                            <option value="Add Weight">Add Weight</option>
                        </select>
                    </div>
                    <button onClick={dijkstra} disabled={state.isSearching}>
                        Find Path
                    </button>
                </div>
                <div className="grid-container">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid-row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={cell.id}
                                    className={`grid-cell ${
                                        state.start === cell.id ? "start" : ""
                                    } ${state.end === cell.id ? "end" : ""} ${
                                        state.walls.includes(cell.id)
                                            ? "wall"
                                            : ""
                                    } ${
                                        state.weights.includes(cell.id)
                                            ? "weight"
                                            : ""
                                    } ${
                                        state.path.some(
                                            (pathCell) =>
                                                pathCell.id === cell.id
                                        )
                                            ? "path"
                                            : ""
                                    } ${
                                        state.visitedNodes.some(
                                            (visited) => visited.id === cell.id
                                        )
                                            ? "visited"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCellClick(rowIndex, colIndex)
                                    }
                                >
                                    {/* cell.id for having id in each cell */}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="steps">
                    <h3>Steps</h3>
                    <p>{currentStep}</p>
                </div>
            </div>
        </>
    );
};

export default Dijkstra;
