const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

function processFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    const originalContent = content;

    if (!content.includes('<Grid')) {
        return;
    }

    const replacements = [
        [/<Grid\s+item\s+xs=\{12\}\s+md=\{4\}\s*>/g, '<Grid size={{ xs: 12, md: 4 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s+md=\{6\}\s*>/g, '<Grid size={{ xs: 12, md: 6 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s+sm=\{6\}\s*>/g, '<Grid size={{ xs: 12, sm: 6 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s+md=\{8\}\s*>/g, '<Grid size={{ xs: 12, md: 8 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s+md=\{7\}\s*>/g, '<Grid size={{ xs: 12, md: 7 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s+md=\{5\}\s*>/g, '<Grid size={{ xs: 12, md: 5 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s*>/g, '<Grid size={{ xs: 12 }}>'],
        [/<Grid\s+item\s+xs=\{6\}\s*>/g, '<Grid size={{ xs: 6 }}>'],
        [/<Grid\s+item\s+xs=\{12\}\s+md=\{6\}\s+key=([^>]+)>/g, '<Grid size={{ xs: 12, md: 6 }} key=$1>'],
        [/<Grid\s+item\s+xs=\{6\}\s+key=([^>]+)>/g, '<Grid size={{ xs: 6 }} key=$1>'],
        [/<Grid\s+item\s*>/g, '<Grid>'],
        [/<Grid\s+xs=\{12\}\s+sm=\{6\}\s*>/g, '<Grid size={{ xs: 12, sm: 6 }}>']
    ];

    for (const [pattern, repl] of replacements) {
        content = content.replace(pattern, repl);
    }

    if (content !== originalContent) {
        console.log('Modified', filepath);
        fs.writeFileSync(filepath, content, 'utf8');
    }
}

processDirectory(path.join(__dirname, 'src'));
