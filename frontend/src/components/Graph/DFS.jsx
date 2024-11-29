import React from "react";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Header from "../header";
import SectionNav from "../sectionNav";
import axios from "axios";

const Dfs = () => {
    const svgRef = useRef(null);
    const [treeData, setTreeData] = useState(null);
    const [nodeNumber, setNodeNumber] = useState("");
    const [targetNodeName, setTargetNodeName] = useState("");
    const [foundNode, setFoundNode] = useState(null);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [logs, setLogs] = useState([]); // State to store logs

    // Effect to draw the tree when data changes
    useEffect(() => {
        if (!treeData) return;

        const width = 700;
        const height = 700;

        // Clear previous SVG content before re-rendering
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(50,50)");

        const treeLayout = d3.tree().size([width - 100, height - 100]);
        const rootNode = d3.hierarchy(treeData);
        treeLayout(rootNode);

        // Draw links
        svg.selectAll(".link")
            .data(rootNode.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", "2px")
            .attr(
                "d",
                d3
                    .linkVertical()
                    .y((d) => d.y)
                    .x((d) => d.x)
            );

        // Draw nodes
        const nodes = svg
            .selectAll(".node")
            .data(rootNode.descendants())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d) => `translate(${d.x},${d.y})`);

        nodes
            .append("circle")
            .attr("r", 8)
            .attr("fill", (d) => {
                if (foundNode && d.data.name === foundNode) return "orange"; // Highlight found node
                if (visitedNodes.includes(d.data.name)) return "red"; // Highlight visited nodes
                return "blue";
            });

        nodes
            .append("text")
            .attr("dy", ".35em")
            .attr("x", (d) => (d.children ? -13 : 13))
            .attr("fill", "white")
            .style("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name);
    }, [treeData, foundNode, visitedNodes]); // Re-render the tree when treeData, foundNode, or visitedNodes changes

    // Function to generate a binary tree with a given number of nodes
    const generateNodes = (number) => {
        if (isNaN(number) || number <= 0) {
            alert("Please enter a valid number of nodes to generate!");
            return;
        }

        const createBinaryTree = (num) => {
            if (num === 0) return null;

            let count = 1;
            const root = { name: `${count}`, children: [] };
            const queue = [root];

            while (count < num) {
                const currentNode = queue.shift();

                // Add left child
                if (count < num) {
                    count++;
                    const leftChild = { name: `${count}`, children: [] };
                    currentNode.children.push(leftChild);
                    queue.push(leftChild);
                }

                // Add right child
                if (count < num) {
                    count++;
                    const rightChild = { name: `${count}`, children: [] };
                    currentNode.children.push(rightChild);
                    queue.push(rightChild);
                }
            }

            return root;
        };

        const newTreeData = createBinaryTree(number);
        setTreeData(newTreeData);
        setNodeNumber("");
        setLogs((prevLogs) => [
            ...prevLogs,
            `Generated tree with ${number} nodes`,
        ]); // Log the action
    };

    // Function to search and highlight a node by name using DFS
    const searchNodeName = async (targetName) => {
        setFoundNode(null);
        setVisitedNodes([]);
        setLogs((prevLogs) => [
            ...prevLogs,
            `Started DFS search for node: ${targetName}`,
        ]);

        if (!targetName) {
            alert("Please enter a node name to search for!");
            return;
        }

        const dfsSearch = async (node) => {
            setVisitedNodes((prevVisitedNodes) => [
                ...prevVisitedNodes,
                node.data.name,
            ]);
            setLogs((prevLogs) => [
                ...prevLogs,
                `Visited node: ${node.data.name}`,
            ]); // Log the visited node

            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (node.data.name === targetName) {
                setFoundNode(targetName); // Highlight the found node
                setLogs((prevLogs) => [
                    ...prevLogs,
                    `Found node: ${targetName}`,
                ]); // Log the found node
                return true;
            }

            if (node.children) {
                for (let child of node.children) {
                    if (await dfsSearch(child)) {
                        return true;
                    }
                }
            }

            return false;
        };

        if (localStorage.getItem("userInfo")) {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "http://localhost:5000/user/topic",
                { userID: userInfo.userID, topic: "DFS", completed: true },
                config
            );

            console.log("Submitted:", {
                data,
            });
        }

        const rootNode = d3.hierarchy(treeData);
        await dfsSearch(rootNode);
        setTargetNodeName(""); // Clear input field after searching
    };

    return (
        <div>
            <Header />
            <SectionNav />
            <h2>Depth First Search Visualization</h2>
            <p>
                Depth First Search (DFS) is an algorithm used for traversing or
                searching tree or graph data structures. The algorithm starts at
                the root node and explores as far as possible along each branch
                before backtracking.
            </p>
            <div style={{ display: "flex", marginTop: "20px" }}>
                <div style={{ flex: "1", marginRight: "20px" }}>
                    <h3>Steps</h3>
                    <ul>
                        <li>
                            Enter the number of nodes and click &apos;Generate
                            Nodes&apos; to create the binary tree.
                        </li>
                        <li>
                            Enter the name of the node you want to search for in
                            the &apos;Node name to search&apos; field.
                        </li>
                        <li>
                            Click &apos;Search Node&apos; to start the DFS
                            traversal and watch the tree being traversed step by
                            step.
                        </li>
                    </ul>
                </div>
                <div style={{ flex: "2" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="number"
                            value={nodeNumber}
                            placeholder="Number of nodes"
                            onChange={(e) => setNodeNumber(e.target.value)}
                            style={{ marginRight: "10px" }}
                        />
                        <button
                            onClick={() => generateNodes(parseInt(nodeNumber))}
                        >
                            Generate Nodes
                        </button>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            value={targetNodeName}
                            placeholder="Node name to search"
                            onChange={(e) => setTargetNodeName(e.target.value)}
                            style={{ marginRight: "10px" }}
                        />
                        <button onClick={() => searchNodeName(targetNodeName)}>
                            Search Node
                        </button>
                    </div>
                    <svg ref={svgRef}></svg>
                </div>
                <div style={{ flex: "1", marginLeft: "20px" }}>
                    <h3>Logs</h3>
                    <div
                        style={{
                            height: "400px",
                            overflowY: "scroll",
                            padding: "10px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {logs.map((log, index) => (
                            <div key={index}>{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dfs;
