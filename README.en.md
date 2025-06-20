# Proyecto_V1
For the Spanish version see [README.md](README.md).

This is a simple web application to manage flashcards without using frameworks. Cards are grouped into **decks** and two card types are supported:

- **Classic**: question and answer.
- **True/False**: statement with a flag indicating if it is true.

Cards are stored in `localStorage` so they persist between page reloads.

## Structure

- `index.html` basic page structure and form.
- `style.css` visual appearance.
- `src/app.js` main logic plus storage and deck modules.

To test the application you must run a local server (for example `npm start`).
Because the project uses ES Modules, you cannot open `index.html` directly.

## Installation

Install Node.js and the project dependencies:

```bash
npm install
```

## Running the server

Start the built-in server with:

```bash
npm start
```

The server will be available at `http://localhost:3000`.

## Running the tests

Execute the test suite using Node.js:

```bash
npm test
```

## Usage

1. Select the card type and fill in the form fields.
2. Select or create a **deck** to organize your cards.
3. Click **Save card** to store it.
4. Each card shows **Edit** and **Delete** buttons:
   - **Edit** loads the card into the form so you can modify it.
   - **Delete** removes only that card from the list.
5. The **Delete all** button removes only the cards from the selected deck.

## License

This project is distributed under the MIT license. See the `LICENSE` file for details.

## Contributing

Contributions are welcome! If you find a problem or want to propose an improvement, open an issue or send a pull request following the standard GitHub workflow. Please run `npm test` before submitting your changes.
