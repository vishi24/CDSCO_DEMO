import json
from graphify.detect import detect
from pathlib import Path

result = detect(Path('.'))
with open('graphify-out/.graphify_detect.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False)
print(f"Corpus: {result.get('total_files', 0)} files · ~{result.get('total_words', 0)} words")
for cat, files in result.get('files', {}).items():
    if files:
        print(f"  {cat}: {len(files)} files")
