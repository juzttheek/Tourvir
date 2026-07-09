import urllib.request
import json

url = "https://api.github.com/repos/juzttheek/Tourly/actions/runs"
req = urllib.request.Request(url)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        for r in data.get('workflow_runs', [])[:5]:
            print(f"ID: {r['id']} | Status: {r['status']} | Conclusion: {r['conclusion']} | Message: {r['head_commit']['message'][:40]}")
except Exception as e:
    print(e)
