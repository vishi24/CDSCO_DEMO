const fs = require('fs');
const path = require('path');

function processFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    for (const [pattern, repl] of replacements) {
        content = content.replace(pattern, repl);
    }

    if (content !== originalContent) {
        console.log('Modified', filePath);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

const appReviewPath = path.join(__dirname, 'src', 'features', 'officer', 'applications', 'ApplicationReview.tsx');
if (fs.existsSync(appReviewPath)) {
    processFile(appReviewPath, [
        [/fontWeight=\{700\}/g, "sx={{ fontWeight: 700 }}"],
        [/fontWeight=\{500\}/g, "sx={{ fontWeight: 500 }}"],
        [/inputProps=/g, "slotProps={{ htmlInput: "],
        [/InputLabelProps=\{\{\s*shrink:\s*true\s*\}\}\s*slotProps=\{\{\s*htmlInput:/g, "slotProps={{ inputLabel: { shrink: true }, htmlInput: "],
        [/InputLabelProps=\{\{\s*shrink:\s*true\s*\}\}/g, "slotProps={{ inputLabel: { shrink: true } }}"],
        [/display="block"/g, "sx={{ display: 'block' }}"],
        [/\(e, v\)/g, "(_e, v)"] // fix unused var e
    ]);
}

const inspectionChecklistPath = path.join(__dirname, 'src', 'features', 'officer', 'applications', 'InspectionChecklist.tsx');
if (fs.existsSync(inspectionChecklistPath)) {
    processFile(inspectionChecklistPath, [
        [/fontWeight=\{?["']?bold["']?\}?/g, "sx={{ fontWeight: 'bold' }}"],
        [/fontWeight=\{500\}/g, "sx={{ fontWeight: 500 }}"],
        [/fontWeight=\{700\}/g, "sx={{ fontWeight: 700 }}"]
    ]);
}
