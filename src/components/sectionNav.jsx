import { Link, useLocation } from "react-router-dom";
import styles from "../css/SectionNav.module.css";

const SectionNav = () => {
    const location = useLocation();
    const path = location.pathname;

    const renderLinks = () => {
        if (path.startsWith("/searching")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/searching/binary">Binary Search</Link>
                    <Link to="/searching/linear">Linear Search</Link>
                </div>
            );
        } else if (path.startsWith("/greedy")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/greedy/bellman-Ford">Bellman Ford</Link>
                    <Link to="/greedy/dijkstra">Dijkstra</Link>
                </div>
            );
        } else if (path.startsWith("/sorting")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/sorting/bubble">Bubble Sort</Link>
                    <Link to="/sorting/quick">Quick Sort</Link>
                    <Link to="/sorting/merge">Merge Sort</Link>
                    <Link to="/sorting/selection">Selection Sort</Link>
                    <Link to="/sorting/insertion">Insertion Sort</Link>
                </div>
            );
        } else if (path.startsWith("/graph")) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/binaryTree">Binary Tree</Link>
                    <Link to="/graph/bfs">Breadth First Search</Link>
                    <Link to="/graph/dfs">Depth First Search</Link>
                </div>
            );
        } else if (
            path.startsWith("/array") ||
            path.startsWith("/queue") ||
            path.startsWith("/stack") ||
            path.startsWith("/linkList")
        ) {
            return (
                <div className={styles.navLinks}>
                    <Link to="/array">Array</Link>
                    <Link to="/queue">Queue</Link>
                    <Link to="/stack">Stack</Link>
                    <Link to="/linkList">Linked List</Link>
                </div>
            );
        } else {
            return null;
        }
    };

    return <div className={styles.navContainer}>{renderLinks()}</div>;
};

export default SectionNav;
