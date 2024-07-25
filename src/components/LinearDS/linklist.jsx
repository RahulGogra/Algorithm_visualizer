import { useState } from "react";
import Header from "../header";
import styles from "../../css/Linklist.module.css";
import SectionNav from "../sectionNav";

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.isVisited = false;
    }
}

const LinkedList = () => {
    const [nodeValue, setNodeValue] = useState("");
    const [head, setHead] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [editNode, setEditNode] = useState(null);
    const [editValue, setEditValue] = useState("");

    const addNode = () => {
        if (nodeValue.trim() === "") return;
        const newNode = new Node(nodeValue);
        if (!head) {
            setHead(newNode);
        } else {
            let currentNode = head;
            while (currentNode.next) {
                currentNode = currentNode.next;
            }
            currentNode.next = newNode;
        }
        setNodeValue("");
        displaySnackbar(`Node "${newNode.value}" added`);
    };

    const deleteNode = (value) => {
        if (!head) return;
        if (head.value === value) {
            setHead(head.next);
            displaySnackbar(`Node "${value}" deleted`);
            return;
        }
        let currentNode = head;
        let previousNode = null;
        while (currentNode && currentNode.value !== value) {
            previousNode = currentNode;
            currentNode = currentNode.next;
        }
        if (currentNode) {
            if (previousNode) {
                previousNode.next = currentNode.next;
            }
            displaySnackbar(`Node "${value}" deleted`);
        }
        setHead({ ...head }); // trigger re-render
    };

    const markAsVisited = (node) => {
        node.isVisited = !node.isVisited;
        setHead({ ...head }); // trigger re-render
        displaySnackbar(
            `Node "${node.value}" marked as ${
                node.isVisited ? "visited" : "not visited"
            }`
        );
    };

    const clearList = () => {
        setHead(null);
        displaySnackbar("List cleared");
    };

    const displaySnackbar = (message) => {
        setSnackbarMessage(message);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
    };

    const handleEdit = (node) => {
        setEditNode(node);
        setEditValue(node.value);
    };

    const handleSave = (node) => {
        if (editValue === "") {
            displaySnackbar(`Node "${node.value}" can't be empty`);
            setEditNode(null);
            setHead({ ...head });
            return;
        }
        node.value = editValue;
        setEditNode(null);
        setHead({ ...head }); // trigger re-render
        displaySnackbar(`Node "${node.value}" updated`);
    };

    const traverse = () => {
        let currentNode = head;
        const listItems = [];
        while (currentNode) {
            const nodeRef = currentNode; // Capture the current node reference
            listItems.push(
                <div key={currentNode.value} className={styles.listItem}>
                    {editNode === nodeRef ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleSave(nodeRef)}
                            autoFocus
                        />
                    ) : (
                        <span onClick={() => handleEdit(nodeRef)}>
                            {currentNode.value}
                        </span>
                    )}
                    <button onClick={() => deleteNode(nodeRef.value)}>
                        Delete
                    </button>
                    <button onClick={() => markAsVisited(nodeRef)}>
                        {nodeRef.isVisited ? "Unmark" : "Mark"} as Visited
                    </button>
                    {nodeRef.isVisited && <span>Visited</span>}
                </div>
            );
            currentNode = currentNode.next;
        }
        return listItems;
    };

    return (
        <>
            <Header />
            <SectionNav />
            <h3>
                Enter the value to generate a linklist of elements Or you can
                perform deletion of the elements as well as mark them as
                visited.
            </h3>
            <div className={styles.linkedListContainer}>
                <label>
                    Node Value:
                    <input
                        type="text"
                        value={nodeValue}
                        onChange={(e) => setNodeValue(e.target.value)}
                    />
                </label>
                <button onClick={addNode}>Add Node</button>
                <button onClick={clearList}>Clear List</button>
            </div>
            <div className={styles.listContainer}>{traverse()}</div>
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

export default LinkedList;
