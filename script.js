/**
 * Mind Map System - Core Logic
 */

let mindMapData = {
    id: "root",
    text: "Ideia Central",
    children: [],
    x: 0,
    y: 0,
    expanded: true
};

let state = {
    selectedNodeId: "root",
    zoom: 1,
    offset: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    isEditing: false,
    isPanning: false,
    panStart: { x: 0, y: 0 },
    draggedNodeId: null,
    dragOffset: { x: 0, y: 0 }
};

let nodesMap = new Map();
const svg = document.getElementById('mindmap-svg');
const viewport = document.getElementById('viewport');
const nodesLayer = document.getElementById('nodes-layer');
const connectionsLayer = document.getElementById('connections-layer');

function init() {
    rebuildNodesMap(mindMapData);
    setupEventListeners();
    render();
}

function rebuildNodesMap(node) {
    nodesMap.set(node.id, node);
    if (node.children) {
        node.children.forEach(child => rebuildNodesMap(child));
    }
}

function findParent(node, targetId) {
    if (!node.children) return null;
    for (let child of node.children) {
        if (child.id === targetId) return node;
        let parent = findParent(child, targetId);
        if (parent) return parent;
    }
    return null;
}

function getAbsolutePos(nodeId) {
    let node = nodesMap.get(nodeId);
    if (!node) return { x: 0, y: 0 };
    if (node.id === "root") return { x: node.x, y: node.y };
    let parent = findParent(mindMapData, nodeId);
    let parentPos = getAbsolutePos(parent.id);
    return { x: parentPos.x + node.x, y: parentPos.y + node.y };
}

function setupEventListeners() {
    window.addEventListener('resize', () => {
        render();
    });

    document.addEventListener('keydown', (e) => {
        if (state.isEditing) return;

        if (e.key === 'Tab') {
            e.preventDefault();
            addChildNode();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            addSiblingNode();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
            deleteNode();
        }
    });

    document.getElementById('add-child-btn').addEventListener('click', addChildNode);
    document.getElementById('add-sibling-btn').addEventListener('click', addSiblingNode);
    document.getElementById('delete-btn').addEventListener('click', deleteNode);
    document.getElementById('export-json-btn').addEventListener('click', exportJSON);

    svg.addEventListener('mousedown', (e) => {
        if (e.target.closest('.collapse-btn')) return;

        const nodeG = e.target.closest('.node');
        if (nodeG) {
            const nodeId = nodeG.getAttribute('data-id');
            if (nodeId !== "root") {
                state.draggedNodeId = nodeId;
                const mousePos = getMousePos(e);
                const absPos = getAbsolutePos(nodeId);
                state.dragOffset = { x: absPos.x - mousePos.x, y: absPos.y - mousePos.y };
            }
            state.selectedNodeId = nodeId;
            render();
            e.stopPropagation();
        } else if (e.button === 0) {
            state.isPanning = true;
            state.panStart = { x: e.clientX - state.offset.x, y: e.clientY - state.offset.y };
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (state.isPanning) {
            state.offset.x = e.clientX - state.panStart.x;
            state.offset.y = e.clientY - state.panStart.y;
            render();
        } else if (state.draggedNodeId) {
            const node = nodesMap.get(state.draggedNodeId);
            const parent = findParent(mindMapData, state.draggedNodeId);
            const parentAbsPos = getAbsolutePos(parent.id);
            const mousePos = getMousePos(e);

            node.x = mousePos.x + state.dragOffset.x - parentAbsPos.x;
            node.y = mousePos.y + state.dragOffset.y - parentAbsPos.y;
            render();
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (state.draggedNodeId) {
            const targetNodeG = e.target.closest('.node');
            if (targetNodeG) {
                const newParentId = targetNodeG.getAttribute('data-id');
                if (newParentId !== state.draggedNodeId && !isDescendant(state.draggedNodeId, newParentId)) {
                    changeParent(state.draggedNodeId, newParentId);
                }
            }
        }
        state.isPanning = false;
        state.draggedNodeId = null;
        render();
    });

    svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.001;
        const delta = -e.deltaY;
        const newZoom = state.zoom * (1 + delta * zoomSpeed);
        if (newZoom > 0.1 && newZoom < 5) {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const dx = (mouseX - state.offset.x) / state.zoom;
            const dy = (mouseY - state.offset.y) / state.zoom;
            state.zoom = newZoom;
            state.offset.x = mouseX - dx * state.zoom;
            state.offset.y = mouseY - dy * state.zoom;
            render();
        }
    }, { passive: false });
}

function getMousePos(e) {
    return {
        x: (e.clientX - state.offset.x) / state.zoom,
        y: (e.clientY - state.offset.y) / state.zoom
    };
}

function isDescendant(parentId, childId) {
    const parent = nodesMap.get(parentId);
    if (!parent || !parent.children) return false;
    for (let child of parent.children) {
        if (child.id === childId) return true;
        if (isDescendant(child.id, childId)) return true;
    }
    return false;
}

function changeParent(nodeId, newParentId) {
    const node = nodesMap.get(nodeId);
    const oldParent = findParent(mindMapData, nodeId);
    const newParent = nodesMap.get(newParentId);

    const oldAbsPos = getAbsolutePos(nodeId);
    oldParent.children = oldParent.children.filter(c => c.id !== nodeId);

    if (!newParent.children) newParent.children = [];
    newParent.children.push(node);

    const newParentAbsPos = getAbsolutePos(newParentId);
    node.x = oldAbsPos.x - newParentAbsPos.x;
    node.y = oldAbsPos.y - newParentAbsPos.y;

    rebuildNodesMap(mindMapData);
}

function addChildNode() {
    const parent = nodesMap.get(state.selectedNodeId);
    if (!parent) return;

    const newNode = {
        id: Date.now().toString(),
        text: "Novo Nó",
        children: [],
        x: 200,
        y: (parent.children ? parent.children.length * 50 : 0),
        expanded: true
    };

    if (!parent.children) parent.children = [];
    parent.children.push(newNode);
    parent.expanded = true;
    rebuildNodesMap(mindMapData);
    state.selectedNodeId = newNode.id;
    render();
    editNode(newNode.id);
}

function addSiblingNode() {
    if (state.selectedNodeId === "root") return;

    const parent = findParent(mindMapData, state.selectedNodeId);
    if (!parent) return;

    const newNode = {
        id: Date.now().toString(),
        text: "Novo Nó",
        children: [],
        x: 200,
        y: (parent.children ? parent.children.length * 50 : 0),
        expanded: true
    };

    parent.children.push(newNode);
    rebuildNodesMap(mindMapData);
    state.selectedNodeId = newNode.id;
    render();
    editNode(newNode.id);
}

function deleteNode() {
    if (state.selectedNodeId === "root") return;

    const parent = findParent(mindMapData, state.selectedNodeId);
    if (!parent) return;

    parent.children = parent.children.filter(child => child.id !== state.selectedNodeId);
    rebuildNodesMap(mindMapData);
    state.selectedNodeId = parent.id;
    render();
}

function editNode(nodeId) {
    const node = nodesMap.get(nodeId);
    if (!node) return;

    state.isEditing = true;
    const nodeElement = document.querySelector(`g[data-id="${nodeId}"]`);
    const rect = nodeElement.querySelector('rect');
    const text = nodeElement.querySelector('text');

    text.style.display = 'none';

    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    const bbox = rect.getBBox();

    foreignObject.setAttribute("x", bbox.x);
    foreignObject.setAttribute("y", bbox.y);
    foreignObject.setAttribute("width", bbox.width);
    foreignObject.setAttribute("height", bbox.height);

    const input = document.createElement("input");
    input.value = node.text;
    input.style.width = "100%";
    input.style.height = "100%";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.textAlign = "center";
    input.style.fontSize = "14px";
    input.style.background = "transparent";

    foreignObject.appendChild(input);
    nodeElement.appendChild(foreignObject);

    input.focus();
    input.select();

    const finishEdit = () => {
        if (!state.isEditing) return;
        node.text = input.value;
        state.isEditing = false;
        render();
    };

    input.addEventListener('blur', finishEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            finishEdit();
        }
    });
}

function toggleExpand(nodeId) {
    const node = nodesMap.get(nodeId);
    if (node) {
        node.expanded = !node.expanded;
        render();
    }
}

function exportJSON() {
    const dataStr = JSON.stringify(mindMapData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'mindmap.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function render() {
    nodesLayer.innerHTML = '';
    connectionsLayer.innerHTML = '';

    viewport.setAttribute('transform', `translate(${state.offset.x}, ${state.offset.y}) scale(${state.zoom})`);

    renderNode(mindMapData, 0, 0);
}

function renderNode(node, absX, absY) {
    const nodeG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    nodeG.setAttribute("class", "node" + (state.selectedNodeId === node.id ? " selected" : ""));
    nodeG.setAttribute("data-id", node.id);
    nodeG.setAttribute("transform", `translate(${absX + node.x}, ${absY + node.y})`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.textContent = node.text;
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dy", "5");

    nodeG.appendChild(rect);
    nodeG.appendChild(text);
    nodesLayer.appendChild(nodeG);

    const bbox = text.getBBox();
    const paddingX = 20;
    const paddingY = 10;
    rect.setAttribute("x", bbox.x - paddingX);
    rect.setAttribute("y", bbox.y - paddingY);
    rect.setAttribute("width", bbox.width + paddingX * 2);
    rect.setAttribute("height", bbox.height + paddingY * 2);

    nodeG.addEventListener('dblclick', (e) => {
        editNode(node.id);
        e.stopPropagation();
    });

    // Collapse/Expand button
    if (node.children && node.children.length > 0) {
        const btnSize = 12;
        const btnG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        btnG.setAttribute("class", "collapse-btn");
        btnG.setAttribute("transform", `translate(${bbox.x + bbox.width + paddingX}, 0)`);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", btnSize / 2);
        circle.setAttribute("fill", "#fff");
        circle.setAttribute("stroke", "#00aaff");
        circle.setAttribute("stroke-width", "1");

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", -btnSize/4);
        line.setAttribute("y1", 0);
        line.setAttribute("x2", btnSize/4);
        line.setAttribute("y2", 0);
        line.setAttribute("stroke", "#00aaff");
        line.setAttribute("stroke-width", "1");

        btnG.appendChild(circle);
        btnG.appendChild(line);

        if (!node.expanded) {
            const lineV = document.createElementNS("http://www.w3.org/2000/svg", "line");
            lineV.setAttribute("x1", 0);
            lineV.setAttribute("y1", -btnSize/4);
            lineV.setAttribute("x2", 0);
            lineV.setAttribute("y2", btnSize/4);
            lineV.setAttribute("stroke", "#00aaff");
            lineV.setAttribute("stroke-width", "1");
            btnG.appendChild(lineV);
        }

        btnG.addEventListener('click', (e) => {
            toggleExpand(node.id);
            e.stopPropagation();
        });

        nodeG.appendChild(btnG);
    }

    if (node.expanded && node.children) {
        node.children.forEach(child => {
            const childAbsX = absX + node.x;
            const childAbsY = absY + node.y;
            renderConnection(absX + node.x, absY + node.y, childAbsX + child.x, childAbsY + child.y);
            renderNode(child, childAbsX, childAbsY);
        });
    }
}

function renderConnection(x1, y1, x2, y2) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "connection");
    const dx = x2 - x1;
    const midX = x1 + dx / 2;
    const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
    path.setAttribute("d", d);
    connectionsLayer.appendChild(path);
}

init();
