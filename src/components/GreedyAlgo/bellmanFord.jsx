// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import Header from "../header";
import SectionNav from "../sectionNav";
import styles from "../../css/BellmanFord.module.css";

const BellmanFord = () => {
    const svgRef = useRef(null);
    const [searchSource, setSearchSource] = useState("");
    const [searchTarget, setSearchTarget] = useState("");
    const [shortestPath, setShortestPath] = useState(null);
    const [data, setData] = useState({
        nodes: [],
        links: [],
        adjacencyList: {},
    });

    const bellmanFord = (graph, startNode, endNode) => {
        if (!graph || !graph.adjacencyList) {
            throw new Error("Invalid graph");
        }

        const nodes = Object.keys(graph.adjacencyList);
        if (!nodes.includes(startNode) || !nodes.includes(endNode)) {
            throw new Error("Invalid start or end node");
        }

        const edges = graph.links;

        const distances = {};
        const predecessors = {};

        try {
            // Step 1: initialize graph
            nodes.forEach((node) => {
                distances[node] = Infinity;
                predecessors[node] = null;
            });
            distances[startNode] = 0;

            console.log("Initial Distances:", distances);

            // Step 2: relax edges repeatedly
            let updated = true;
            let iterations = 0;
            while (updated) {
                updated = false; // Track if any distance was updated in this iteration
                edges.forEach(({ source, target, weight }) => {
                    console.log(
                        `Checking edge from ${source.id} to ${target.id} with weight ${weight}`
                    );
                    if (distances[source.id] + weight < distances[target.id]) {
                        distances[target.id] = distances[source.id] + weight;
                        predecessors[target.id] = source.id;
                        updated = true; // Mark that we made an update
                        console.log(
                            `Relaxed ${source.id} -> ${target.id} with weight ${weight}`
                        );
                        console.log("Updated Distances:", distances);
                        console.log("Updated Predecessors:", predecessors);
                    }
                });
                iterations++;
                if (iterations > nodes.length - 1) {
                    throw new Error("Graph contains a negative-weight cycle");
                }
            }

            console.log("Final Distances:", distances);
            console.log("Predecessors:", predecessors);

            // Extract shortest path
            let path = [];
            let currentNode = endNode;

            while (currentNode !== null) {
                path.push(currentNode);
                currentNode = predecessors[currentNode];
            }

            path.reverse();

            if (path[0] !== startNode) {
                // If the start node is not at the beginning, no valid path was found
                throw new Error("No path exists between the specified nodes");
            }

            highlightPath(path);
            setShortestPath(path);
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const generateRandomGraph = (numNodes, numLinks) => {
        const nodes = [];
        const links = [];
        const adjacencyList = {};

        for (let i = 0; i < numNodes; i++) {
            const nodeId = `A${i}`;
            nodes.push({
                id: nodeId,
                x: Math.random() * 100,
                y: Math.random() * 100,
            });
            adjacencyList[nodeId] = [];
        }

        while (links.length < numLinks) {
            const sourceIndex = Math.floor(Math.random() * numNodes);
            const targetIndex = Math.floor(Math.random() * numNodes);

            if (sourceIndex !== targetIndex) {
                const sourceNode = nodes[sourceIndex].id;
                const targetNode = nodes[targetIndex].id;

                // Ensure no duplicate links
                if (
                    !links.some(
                        (link) =>
                            (link.source === sourceNode &&
                                link.target === targetNode) ||
                            (link.source === targetNode &&
                                link.target === sourceNode)
                    )
                ) {
                    const weight = Math.floor(Math.random() * 10 + 1);
                    links.push({
                        source: sourceNode,
                        target: targetNode,
                        weight,
                    });
                    adjacencyList[sourceNode].push({
                        target: targetNode,
                        weight,
                    });
                    adjacencyList[targetNode].push({
                        target: sourceNode,
                        weight,
                    }); // if the graph is undirected
                }
            }
        }

        console.log("Generated Nodes:", nodes);
        console.log("Generated Links:", links);
        console.log("Adjacency List:", adjacencyList);

        setData({ nodes, links, adjacencyList });
    };

    const handleSearch = async () => {
        try {
            bellmanFord(data, searchSource, searchTarget);

            if (localStorage.getItem("userInfo")) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));

                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };
                const { data } = await axios.post(
                    import.meta.env.VITE_topic,
                    {
                        userID: userInfo.userID,
                        topic: "Bellman Ford",
                        completed: true,
                    },
                    config
                );

                console.log("Submitted:", {
                    data,
                });
            }
        } catch (error) {
            console.error(error);
            alert("Error: " + error.message);
            setShortestPath(null);
        }
    };

    const highlightPath = async (path) => {
        const svg = d3.select(svgRef.current);

        // Reset previous highlights
        svg.selectAll("line")
            .attr("stroke", "#999")
            .attr("stroke-width", (d) => Math.sqrt(d.weight));

        for (let i = 0; i < path.length - 1; i++) {
            const sourceNode = path[i];
            const targetNode = path[i + 1];

            svg.selectAll("line")
                .filter(
                    (d) =>
                        (d.source.id === sourceNode &&
                            d.target.id === targetNode) ||
                        (d.source.id === targetNode &&
                            d.target.id === sourceNode)
                )
                .attr("stroke", "red")
                .attr("stroke-width", 5);

            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
        }
    };

    useEffect(() => {
        generateRandomGraph(6, 10); // Adjust the number of nodes and links as needed
    }, []);

    useEffect(() => {
        const svg = d3
            .select(svgRef.current)
            .attr("width", 800)
            .attr("height", 600);

        // Clear previous elements
        svg.selectAll("*").remove();

        // Define arrowhead marker
        svg.append("defs")
            .append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#999");

        const link = svg
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke-width", (d) => Math.sqrt(d.weight))
            .attr("marker-end", "url(#arrowhead)"); // Attach the marker

        const node = svg
            .append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", 5)
            .attr("fill", "#69b3a2")
            .call(
                d3
                    .drag()
                    .on("start", (event, d) => {
                        if (!event.active)
                            simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on("end", (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    })
            );

        const label = svg
            .append("g")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .attr("fill", "white") // Set text color to white
            .attr("dy", -3)
            .attr("dx", 8)
            .text((d) => d.id);

        const label2 = svg
            .append("g")
            .selectAll("text")
            .data(data.links)
            .join("text")
            .attr("fill", "white") // Set text color to white
            .attr("dy", -3)
            .attr("dx", 8)
            .text((links) => links.weight);

        const simulation = d3
            .forceSimulation(data.nodes)
            .force(
                "link",
                d3
                    .forceLink(data.links)
                    .id((d) => d.id)
                    .distance(200)
            )
            .force("charge", d3.forceManyBody().strength(-1500))
            .force("center", d3.forceCenter(800 / 2, 600 / 2));

        simulation.on("tick", () => {
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);

            label2
                .attr("x", (d) => (d.source.x + d.target.x) / 2)
                .attr("y", (d) => (d.source.y + d.target.y) / 2);

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

            label.attr("x", (d) => d.x).attr("y", (d) => d.y);
        });

        return () => {
            simulation.stop();
        };
    }, [data]);

    return (
        <div className={styles.container}>
            <Header />
            <SectionNav />
            <div></div>
            <div className="theory-section">
                <h2>Bellman Ford Algorithm</h2>
                <p>
                    The Bellman-Ford algorithm is a graph search algorithm that
                    finds the shortest path from a source node to all other
                    nodes in a weighted graph.It is a modification of
                    Dijkstra&apos;s algorithm that can handle negative weight
                    edges.
                </p>
            </div>
            <div className={styles.Buttons}>
                <div>
                    <label htmlFor="searchSource" className={styles.label}>
                        Search Source :
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        value={searchSource}
                        onChange={(e) => setSearchSource(e.target.value)}
                    />
                    <label htmlFor="searchTarget" className={styles.label}>
                        Search Target :
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        value={searchTarget}
                        onChange={(e) => setSearchTarget(e.target.value)}
                    />
                </div>
                <div className={styles.divbutton}>
                    <button
                        className={styles.button}
                        onClick={() => generateRandomGraph(6, 10)}
                    >
                        Generate Random Graph
                    </button>
                    <button className={styles.button} onClick={handleSearch}>
                        Search Shortest Path
                    </button>
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.svgContainer}>
                    <svg ref={svgRef} />
                </div>
                {(shortestPath && (
                    <div className={styles.shortestPath}>
                        <h3>Shortest Path:</h3>
                        <p>{shortestPath.join(" -> ")}</p>
                    </div>
                )) || (
                    <div className={styles.shortestPath}>
                        <h3>Shortest Path:</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BellmanFord;
