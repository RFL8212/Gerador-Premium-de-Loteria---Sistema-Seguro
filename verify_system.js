const fs = require('fs');
const path = require('path');

// Basic verification script for the Mind Map System

function verifyFiles() {
    const requiredFiles = ['index.html', 'style.css', 'script.js'];
    for (const file of requiredFiles) {
        if (!fs.existsSync(path.join(__dirname, file))) {
            throw new Error(`Arquivo obrigatório faltando: ${file}`);
        }
        console.log(`OK: ${file} existe.`);
    }
}

function verifyDataStructure() {
    const scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

    // Check for mindMapData initialization
    if (!scriptContent.includes('let mindMapData = {')) {
        throw new Error('Modelo de dados mindMapData não encontrado em script.js');
    }

    // Check for core functions
    const requiredFunctions = [
        'addChildNode',
        'addSiblingNode',
        'deleteNode',
        'render',
        'renderNode',
        'editNode',
        'exportJSON'
    ];

    for (const func of requiredFunctions) {
        if (!scriptContent.includes(`function ${func}`)) {
            throw new Error(`Função obrigatória faltando: ${func}`);
        }
        console.log(`OK: Função ${func} encontrada.`);
    }
}

function verifyHTMLStructure() {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

    const requiredElements = [
        'id="mindmap-svg"',
        'id="viewport"',
        'id="add-child-btn"',
        'id="add-sibling-btn"',
        'id="delete-btn"',
        'id="export-json-btn"'
    ];

    for (const el of requiredElements) {
        if (!htmlContent.includes(el)) {
            throw new Error(`Elemento HTML obrigatório faltando: ${el}`);
        }
        console.log(`OK: Elemento ${el} encontrado.`);
    }
}

try {
    console.log("Iniciando verificação do sistema...");
    verifyFiles();
    verifyDataStructure();
    verifyHTMLStructure();
    console.log("---");
    console.log("Verificação concluída com sucesso! Todas as funcionalidades principais e estruturas estão presentes.");
} catch (error) {
    console.error("FALHA NA VERIFICAÇÃO:", error.message);
    process.exit(1);
}
