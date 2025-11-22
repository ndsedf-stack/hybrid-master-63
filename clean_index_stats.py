import re

with open('index.html', 'r') as f:
    content = f.read()

# Trouve la section stats
match = re.search(r'(<section id="tab-stats"[^>]*>)(.*?)(</section>)', content, re.DOTALL)
if match:
    start_tag = match.group(1)
    old_content = match.group(2)
    end_tag = match.group(3)
    
    # Garde SEULEMENT les boutons
    buttons = re.search(r'(<div style="display:flex.*?</div>)', old_content, re.DOTALL)
    if buttons:
        new_content = buttons.group(1)
        
        # Remplace
        new_section = start_tag + '\n' + new_content + '\n        ' + end_tag
        content = content.replace(match.group(0), new_section)
        
        with open('index.html', 'w') as f:
            f.write(content)
        print("✅ Section stats nettoyée - garde juste les boutons")
