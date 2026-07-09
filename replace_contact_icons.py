import urllib.request
import os
import glob
import re

phone_svg = '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>'
email_svg = '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>'
pin_svg = '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'

# Fetch WhatsApp SVG from jsdelivr CDN
url = 'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/whatsapp.svg'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req)
svg_raw = response.read().decode('utf-8')
path_match = re.search(r'<path d="([^"]+)"', svg_raw)
whatsapp_svg = f'<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="{path_match.group(1)}"/></svg>'

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Phone
    content = re.sub(r'(class="[^"]*icon[^"]*"[^>]*>\s*)📞(\s*<)', r'\g<1>' + phone_svg + r'\g<2>', content)
    # Replace Email
    content = re.sub(r'(class="[^"]*icon[^"]*"[^>]*>\s*)✉️(\s*<)', r'\g<1>' + email_svg + r'\g<2>', content)
    # Replace WhatsApp
    content = re.sub(r'(class="[^"]*icon[^"]*"[^>]*>\s*)💬(\s*<)', r'\g<1>' + whatsapp_svg + r'\g<2>', content)
    # Replace Pin
    content = re.sub(r'(class="[^"]*icon[^"]*"[^>]*>\s*)📍(\s*<)', r'\g<1>' + pin_svg + r'\g<2>', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(html_files)} HTML files with contact SVGs.")
