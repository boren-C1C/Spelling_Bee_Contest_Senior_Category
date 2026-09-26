SPelling Bee Contest - separated word data

Files:
- index.html   = page structure
- style.css    = design
- app.js       = application logic
- words.json   = words + part of speech + definitions

To add/edit words:
Open words.json and add objects in this format:
{
  "word": "example",
  "partOfSpeech": "noun",
  "definition": "A thing that illustrates or explains something."
}

Important:
Because index.html loads words.json with fetch(), opening index.html directly as file:// may be blocked by some browsers.
Run it with a small local server, for example:
  python -m http.server 8000
Then open:
  http://localhost:8000/
