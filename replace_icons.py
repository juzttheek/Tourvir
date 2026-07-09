import urllib.request
import os
import glob
import re

# Fetch SVGs from jsdelivr CDN
icons = {
    'facebook': 'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/facebook.svg',
    'instagram': 'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/instagram.svg',
    'x': 'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/x.svg',
    'tiktok': 'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/tiktok.svg'
}

svgs = {}
for name, url in icons.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req)
    svg_raw = response.read().decode('utf-8')
    # Extract path
    path_match = re.search(r'<path d="([^"]+)"', svg_raw)
    path = path_match.group(1)
    svg_code = f'<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="{path}"/></svg>'
    svgs[name] = svg_code

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Facebook f
    content = re.sub(r'(class="(?:sidebar|footer)__social-link"[^>]*>)\s*f\s*</a>', r'\g<1>' + svgs['facebook'] + '</a>', content)
    # Replace Instagram 📷
    content = re.sub(r'(class="(?:sidebar|footer)__social-link"[^>]*>)\s*📷\s*</a>', r'\g<1>' + svgs['instagram'] + '</a>', content)
    # Replace X 𝕏
    content = re.sub(r'(class="(?:sidebar|footer)__social-link"[^>]*>)\s*𝕏\s*</a>', r'\g<1>' + svgs['x'] + '</a>', content)
    # Replace YouTube ▶ with TikTok
    content = re.sub(r'(class="(?:sidebar|footer)__social-link"[^>]*>)\s*▶\s*</a>', r'\g<1>' + svgs['tiktok'] + '</a>', content)
    
    # Also fix aria-labels if any
    content = content.replace('aria-label="YouTube"', 'aria-label="TikTok"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(html_files)} HTML files.")
