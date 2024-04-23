const express = require("express");
const path = require("path");
const id = require("./helper/idcreator");
const fs = require("fs");
// const db = require("./db/db.json");

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a Note`);

  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNotes = {
      title,
      text,
      note_id: id(),
    };

    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNotes);

    // Write the string to a file
    fs.appendFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `A note for ${newNotes.title} has been written to JSON file`
          )
    );

    const response = {
      status: 'success',
      body: newNotes,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in adding notes');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);