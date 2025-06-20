# Proyecto_V1

This is a simple web application to manage flashcards without using frameworks. Cards are grouped into **decks** and two card types are supported:

- **Classic**: question and answer.
- **True/False**: statement with a flag indicating if it is true.

Cards are stored in `localStorage` so they persist between page reloads.

## Structure

- `index.html` basic page structure and form.
- `style.css` visual appearance.
- `src/app.js` main logic plus storage and deck modules.

To test the application open `index.html` in your browser.

## Installation

Install dependencies and run the included server:

```bash
npm install
npm start
```

This will launch `serve` on the current folder. Open the browser at the address shown in the terminal to use the app.
