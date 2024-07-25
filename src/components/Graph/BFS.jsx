import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import Header from "../header";
import SectionNav from "../sectionNav";

function Bfs() {
    const svgRef = useRef(null);
    const [treeData, setTreeData] = useState(null);
    const [nodeNumber, setNodeNumber] = useState("");
    const [targetNodeName, setTargetNodeName] = useState("");
    const [foundNode, setFoundNode] = useState(null);
    const [visitedNodes, setVisitedNodes] = useState([]); // State to keep track of visited nodes
    const [visitedLinks, setVisitedLinks] = useState([]);

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
            )
            .attr("fill", (d) => {
                if (visitedLinks.includes(d.data.name)) return "red";
                return;
            });

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
        setFoundNode(null);
        setVisitedNodes([]);
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
        setNodeNumber(""); // Clear input field after generating nodes
    };

    // Function to search and highlight a node by name
    const searchNodeName = (targetName) => {
        setFoundNode(null);
        setVisitedNodes([]);
        if (!targetName) {
            alert("Please enter a node name to search for!");
            return;
        }

        const bfsSearch = (node) => {
            const queue = [node];
            const search = () => {
                if (queue.length === 0) return;
                const currentNode = queue.shift();
                setVisitedNodes((prevVisitedNodes) => [
                    ...prevVisitedNodes,
                    currentNode.name,
                ]);
                if (currentNode.name === targetName) {
                    setFoundNode(targetName); // Highlight the found node
                    return;
                }
                if (currentNode.children) {
                    queue.push(...currentNode.children);
                }
                setTimeout(search, 500); // Recursively call search after 500ms delay
            };
            search();
        };

        bfsSearch(treeData);
        setTargetNodeName(""); // Clear input field after searching
    };

    return (
        <div>
            <Header />
            <SectionNav />
            <h2>Breadth First Search Visualization</h2>
            <svg ref={svgRef}></svg>
            <div style={{ marginTop: "20px" }}>
                <input
                    type="number"
                    value={nodeNumber}
                    placeholder="Number of nodes"
                    onChange={(e) => setNodeNumber(e.target.value)}
                    style={{ marginRight: "10px" }}
                />
                <button onClick={() => generateNodes(parseInt(nodeNumber))}>
                    Generate Nodes
                </button>
            </div>
            <div style={{ marginTop: "20px" }}>
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
        </div>
    );
}

export default Bfs;
