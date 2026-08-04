import os
import re

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                process_file(filepath)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # If it contains <Grid item, we will replace it
    if '<Grid' not in content:
        return

    # Replace <Grid item xs={12} md={6}> with <Grid size={{ xs: 12, md: 6 }}>
    # We will use regex to find all <Grid item ...>
    
    # regex for Grid with item
    # We'll iteratively replace common patterns to be safe
    replacements = [
        (r'<Grid\s+item\s+xs=\{12\}\s+md=\{4\}\s*>', '<Grid size={{ xs: 12, md: 4 }}>'),
        (r'<Grid\s+item\s+xs=\{12\}\s+md=\{6\}\s*>', '<Grid size={{ xs: 12, md: 6 }}>'),
        (r'<Grid\s+item\s+xs=\{12\}\s+sm=\{6\}\s*>', '<Grid size={{ xs: 12, sm: 6 }}>'),
        (r'<Grid\s+item\s+xs=\{12\}\s+md=\{8\}\s*>', '<Grid size={{ xs: 12, md: 8 }}>'),
        (r'<Grid\s+item\s+xs=\{12\}\s+md=\{7\}\s*>', '<Grid size={{ xs: 12, md: 7 }}>'),
        (r'<Grid\s+item\s+xs=\{12\}\s+md=\{5\}\s*>', '<Grid size={{ xs: 12, md: 5 }}>'),
        (r'<Grid\s+item\s+xs=\{12\}\s*>', '<Grid size={{ xs: 12 }}>'),
        (r'<Grid\s+item\s+xs=\{6\}\s*>', '<Grid size={{ xs: 6 }}>'),
        
        # with key
        (r'<Grid\s+item\s+xs=\{12\}\s+md=\{6\}\s+key=([^>]+)>', r'<Grid size={{ xs: 12, md: 6 }} key=\1>'),
        (r'<Grid\s+item\s+xs=\{6\}\s+key=([^>]+)>', r'<Grid size={{ xs: 6 }} key=\1>'),
        
        # Just item
        (r'<Grid\s+item\s*>', '<Grid>'),
        
        # the grid from RegistrationPage that I manually replaced with xs={12} sm={6}
        (r'<Grid\s+xs=\{12\}\s+sm=\{6\}\s*>', '<Grid size={{ xs: 12, sm: 6 }}>')
    ]
    
    original_content = content
    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)
        
    if content != original_content:
        print(f"Modified {filepath}")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

process_directory(r'd:\CDSCO_DEMO\frontend\src')
