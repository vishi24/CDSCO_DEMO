const fs = require('fs');
const path = require('path');

function replaceFile(filePath, replacements) {
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
    replaceFile(appReviewPath, [
        [/fontWeight=\{?["']?bold["']?\}?/g, "sx={{ fontWeight: 'bold' }}"],
        [/fontWeight=\{?(\d+)\}?/g, "sx={{ fontWeight: $1 }}"],
        [/display="block"/g, "sx={{ display: 'block' }}"],
        [/inputProps=/g, "slotProps={{ htmlInput: "],
        [/InputLabelProps=/g, "slotProps={{ inputLabel: "],
        // The above slotProps replacement might be nested incorrectly if they look like inputProps={{...}} -> slotProps={{ htmlInput: {{...}} }}
        // Let's refine it:
    ]);
}

// better refinement for ApplicationReview.tsx:
// Actually, in ApplicationReview.tsx, I should just read and string replace.
