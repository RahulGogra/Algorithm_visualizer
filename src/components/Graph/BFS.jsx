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
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [visitedLinks] = useState([]);

    useEffect(() => {
        if (!treeData) return;

        const width = 700;
        const height = 700;

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
                if (visitedLinks.includes(d.name)) return "red";
                return "none";
            });

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
                if (foundNode && d.data.name === foundNode) return "orange";
                if (visitedNodes.includes(d.data.name)) return "red";
                return "blue";
            });

        nodes
            .append("text")
            .attr("dy", ".35em")
            .attr("x", (d) => (d.children ? -13 : 13))
            .attr("fill", "white")
            .style("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name);
    }, [treeData, foundNode, visitedNodes, visitedLinks]);

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

                if (count < num) {
                    count++;
                    const leftChild = { name: `${count}`, children: [] };
                    currentNode.children.push(leftChild);
                    queue.push(leftChild);
                }

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
    };

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
                    setFoundNode(targetName);
                    return;
                }
                if (currentNode.children) {
                    queue.push(...currentNode.children);
                }
                setTimeout(search, 500);
            };
            search();
        };

        bfsSearch(treeData);
        setTargetNodeName("");
    };

    return (
        <div>
            <Header />
            <SectionNav />
            <div style={{ padding: "20px" }}>
                <h2>Understanding Breadth-First Search (BFS)</h2>
                <p>
                    Breadth-First Search (BFS) is an algorithm for traversing or
                    searching tree or graph data structures. It starts at the
                    root node and explores all nodes at the present depth before
                    moving on to the nodes at the next depth level. BFS is
                    commonly used in shortest path algorithms and in situations
                    where we need to explore all possible paths in an unweighted
                    graph or tree.
                </p>
            </div>
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
            <div style={{ display: "flex", marginTop: "20px" }}>
                <div
                    style={{
                        width: "20%",
                        padding: "20px",
                    }}
                >
                    <h3>Steps to Use</h3>
                    <ol>
                        <li>
                            Enter the number of nodes to generate the binary
                            tree.
                        </li>
                        <li>
                            Click on &apos;Generate Nodes&apos; to create the
                            tree.
                        </li>
                        <li>Enter the node name to search in the tree.</li>
                        <li>
                            Click on &apos;Search Node&apos; to start the BFS
                            traversal.
                        </li>
                    </ol>
                </div>

                <div style={{ width: "60%", textAlign: "center" }}>
                    <svg ref={svgRef}></svg>
                </div>

                <div
                    style={{
                        width: "20%",
                        padding: "20px",
                    }}
                >
                    <h3>Logs</h3>
                    <div
                        style={{
                            height: "400px",
                            overflowY: "scroll",
                            padding: "10px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {visitedNodes.map((node, index) => (
                            <div key={index}>{`Visited Node: ${node}`}</div>
                        ))}
                        {foundNode && <div>{`Found Node: ${foundNode}`}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bfs;
