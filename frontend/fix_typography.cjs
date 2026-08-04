const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // regex to find `<Typography ... fontWeight={...} ... >`
    // It's safer to use a regex that matches the whole tag and modifies it.
    // Let's match `<Typography ...>`
    content = content.replace(/<Typography([^>]*)>/g, (match, propsString) => {
        let newProps = propsString;

        // Extract fontWeight
        let fontWeight = null;
        const fwMatch = newProps.match(/fontWeight=\{([^}]+)\}/);
        if (fwMatch) {
            fontWeight = fwMatch[1];
            newProps = newProps.replace(/fontWeight=\{[^}]+\}/, '');
        } else {
            const fwMatchStr = newProps.match(/fontWeight="([^"]+)"/);
            if (fwMatchStr) {
                fontWeight = `'${fwMatchStr[1]}'`;
                newProps = newProps.replace(/fontWeight="[^"]+"/, '');
            }
        }

        // Extract display
        let display = null;
        const dMatch = newProps.match(/display="([^"]+)"/);
        if (dMatch) {
            display = `'${dMatch[1]}'`;
            newProps = newProps.replace(/display="[^"]+"/, '');
        }

        if (!fontWeight && !display) {
            return match; // no change
        }

        // Check if there is an existing sx prop
        const sxMatch = newProps.match(/sx=\{\{\s*(.*?)\s*\}\}/);
        if (sxMatch) {
            let sxContent = sxMatch[1];
            if (fontWeight) sxContent += `, fontWeight: ${fontWeight}`;
            if (display) sxContent += `, display: ${display}`;
            newProps = newProps.replace(/sx=\{\{\s*.*?\s*\}\}/, `sx={{ ${sxContent} }}`);
        } else {
            let sxContent = [];
            if (fontWeight) sxContent.push(`fontWeight: ${fontWeight}`);
            if (display) sxContent.push(`display: ${display}`);
            newProps += ` sx={{ ${sxContent.join(', ')} }}`;
        }

        return `<Typography${newProps}>`;
    });

    if (content !== originalContent) {
        console.log('Modified', filePath);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

const dirSrc = path.join(__dirname, 'src');
function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                processFile(fullPath);
            }
        }
    });
}

walk(dirSrc);
