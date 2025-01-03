import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import BubbleSort from "./components/SortingAlgo/bubbleSort";
import QuickSort from "./components/SortingAlgo/quickSort";
import MergeSort from "./components/SortingAlgo/mergeSort";
import SelectionSort from "./components/SortingAlgo/selectionSort";
import InsertionSort from "./components/SortingAlgo/insertionSort";

import BinarySearch from "./components/SearchingAlgo/binarySearch";
import LinearSearch from "./components/SearchingAlgo/linearSearch";

import Dijkstra from "./components/GreedyAlgo/dijkstra";
import BellmanFord from "./components/GreedyAlgo/bellmanFord";

import Dfs from "./components/Graph/DFS";
import Bfs from "./components/Graph/BFS";
import BinaryTree from "./components/Graph/binarytree";

import Linklist from "./components/LinearDS/linklist";
import Array from "./components/LinearDS/array";
import Stack from "./components/LinearDS/stack";
import Queue from "./components/LinearDS/queue";

import Auth from "./user/auth";
import Profile from "./user/profile";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/searching/binary" element={<BinarySearch />} />
                <Route path="/searching/linear" element={<LinearSearch />} />
                <Route path="/greedy/bellman-Ford" element={<BellmanFord />} />
                <Route path="/greedy/dijkstra" element={<Dijkstra />} />
                <Route path="/sorting/bubble" element={<BubbleSort />} />
                <Route path="/sorting/quick" element={<QuickSort />} />
                <Route path="/sorting/merge" element={<MergeSort />} />
                <Route path="/sorting/selection" element={<SelectionSort />} />
                <Route path="/sorting/insertion" element={<InsertionSort />} />
                <Route path="/graph/bfs" element={<Bfs />} />
                <Route path="/graph/dfs" element={<Dfs />} />
                <Route path="/graph/binaryTree" element={<BinaryTree />} />
                <Route path="/array" element={<Array />} />
                <Route path="/stack" element={<Stack />} />
                <Route path="/queue" element={<Queue />} />
                <Route path="/linklist" element={<Linklist />} />
                <Route path="/Auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
