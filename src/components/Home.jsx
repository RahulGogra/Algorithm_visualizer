import "../css/Home.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";

const Home = () => {
    let [searching, setSearching] = useState("");

    const setSearchAlgo = () => {
        setSearching(searching === "Searching" ? "" : "Searching");
    };
    const setGreedyAlgo = () => {
        setSearching(searching === "Greedy" ? "" : "Greedy");
    };
    const setSortAlgo = () => {
        setSearching(searching === "Sorting" ? "" : "Sorting");
    };
    const setGraphTraversal = () => {
        setSearching(searching === "GraphTraversal" ? "" : "GraphTraversal");
    };
    const setLinearDS = () => {
        setSearching(searching === "LinearDS" ? "" : "LinearDS");
    };

    return (
        <>
            <Header />
            <div className="Algorithms">
                <p>
                    This web application helps you visualize various data
                    structures and algorithms. You can explore different
                    algorithms and understand how they work with step-by-step
                    visualizations. Click on the buttons below to get started!
                </p>
                <div className="Algo_button" onClick={setSearchAlgo}>
                    <img src="/searching.jpg" alt="Searching Algorithms" />
                    <span>Searching Algorithms</span>
                    {searching === "Searching" && (
                        <div className="Algo_list">
                            <h2>Searching Algorithms</h2>
                            <ul>
                                <li>
                                    <Link to="/searching/binary">
                                        Binary Search
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/searching/linear">
                                        Linear Search
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="Algo_button" onClick={setGreedyAlgo}>
                    <img src="/greedy.jpg" alt="Greedy Algorithms" />
                    <span>Greedy Algorithms</span>
                    {searching === "Greedy" && (
                        <div className="Algo_list">
                            <h2>Greedy Algorithms</h2>
                            <ul>
                                <li>
                                    <Link to="/greedy/bellman-Ford">
                                        Bellman-Ford
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/greedy/dijkstra">Dijkstra</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="Algo_button" onClick={setSortAlgo}>
                    <img src="/sorting.png" alt="Sorting Algorithms" />
                    <span>Sorting Algorithms</span>
                    {searching === "Sorting" && (
                        <div className="Algo_list">
                            <h2>Sorting Algorithms</h2>
                            <ul>
                                <li>
                                    <Link to="/sorting/bubble">
                                        Bubble Sort
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sorting/quick">Quick Sort</Link>
                                </li>
                                <li>
                                    <Link to="/sorting/merge">Merge Sort</Link>
                                </li>
                                <li>
                                    <Link to="/sorting/selection">
                                        Selection Sort
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/sorting/insertion">
                                        Insertion Sort
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="Algo_button" onClick={setGraphTraversal}>
                    <img src="/graphTraversal.jpg" alt="Graph Traversal" />
                    <span>Graph Traversal</span>
                    {searching === "GraphTraversal" && (
                        <div className="Algo_list">
                            <h2>Graph Traversal</h2>
                            <ul>
                                <li>
                                    <Link to="/graph/binaryTree">
                                        Binary Tree
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/graph/bfs">
                                        Breadth First Search
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/graph/dfs">
                                        Depth First Search
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="Algo_button" onClick={setLinearDS}>
                    <img src="/graphTraversal.jpg" alt="Graph Traversal" />
                    <span>Linear Data Structures</span>
                    {searching === "LinearDS" && (
                        <div className="Algo_list">
                            <h2>Linear Data Structures</h2>
                            <ul>
                                <li>
                                    <Link to="/array">Array</Link>
                                </li>
                                <li>
                                    <Link to="/queue">Queue</Link>
                                </li>
                                <li>
                                    <Link to="/stack">Stack</Link>
                                </li>
                                <li>
                                    <Link to="/linkList">Linked List</Link>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
