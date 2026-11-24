"""Bundle the site into one self-contained HTML file (soaportal.html).

Phones open downloaded HTML through content:// links, which can't load the
separate css/js/image files, so everything is inlined here.
Run:  python3 build.py
"""
import base64
from pathlib import Path

root = Path(__file__).parent
html = (root / "index.html").read_text()
css = (root / "css/style.css").read_text()
data = (root / "js/data.js").read_text()
app = (root / "js/app.js").read_text()
photo = base64.b64encode((root / "assets/student-photo.jpg").read_bytes()).decode()

data = data.replace('"assets/student-photo.jpg"', f'"data:image/jpeg;base64,{photo}"')
html = html.replace('<link rel="stylesheet" href="css/style.css" />', f"<style>\n{css}\n</style>")
html = html.replace('<script src="js/data.js"></script>', f"<script>\n{data}\n</script>")
html = html.replace('<script src="js/app.js"></script>', f"<script>\n{app}\n</script>")

(root / "soaportal.html").write_text(html)
print("wrote soaportal.html", len(html), "bytes")
