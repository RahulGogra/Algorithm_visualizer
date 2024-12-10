// eslint-disable-next-line no-unused-vars
import React from "react";
import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "../css/Ball.module.css";

const Ball = () => {
    const svgRef = useRef(null);
    const [data, setData] = useState({
        nodes: [],
        links: [],
        adjacencyList: {},
    });

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
                    links.push({
                        source: sourceNode,
                        target: targetNode,
                    });
                    adjacencyList[sourceNode].push({ target: targetNode });
                    adjacencyList[targetNode].push({ target: sourceNode }); // if the graph is undirected
                }
            }
        }

        console.log("Generated Nodes:", nodes);
        console.log("Generated Links:", links);
        console.log("Adjacency List:", adjacencyList);

        setData({ nodes, links, adjacencyList });
    };

    useEffect(() => {
        generateRandomGraph(15, 90); // Adjust the number of nodes and links as needed
    }, []);

    useEffect(() => {
        const svg = d3
            .select(svgRef.current)
            .attr("width", "100%")
            .attr("height", "100%");

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
            .attr("stroke-width", 1)
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

            node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
        });

        return () => {
            simulation.stop();
        };
    }, [data]);

    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.svgContainer}>
                    <svg ref={svgRef} />
                </div>
            </div>
        </div>
    );
};

export default Ball;
