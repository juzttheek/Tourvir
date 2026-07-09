import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert sidebar nav icon for Contact Us
    content = re.sub(r'(class="sidebar__nav-icon">)<svg[^>]+><path[^>]+></svg>(</span>\s*Contact Us)', r'\g<1>📞\g<2>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Reverted sidebar nav icon in {len(html_files)} HTML files.")
