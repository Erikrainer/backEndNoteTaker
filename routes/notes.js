const notes = require('express').Router();

const id = require("../helper/idcreator");

const fs = require("fs");

notes.get("/", (req, res) => {
  console.info(`${req.method} request received for notes`);

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const notesParsed = JSON.parse(data);
      res.json(notesParsed);
    }
  })
})
// POST request to add a note
notes.post('/', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNotes = {
        title,
        text,
        id: id(),
      };
  
      // Obtain existing notes
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNotes);
  
          // Write updated notes back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNotes,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

  notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
  
    // Read the file containing the array of notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading file' });
      }
  
      // Convert the JSON string into an array of notes
      let notes = JSON.parse(data);
  
      // Find the index of the note with the given ID
      const index = notes.findIndex(note => note.id === noteId);
  
      // If note not found, return 404
      if (index === -1) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      // Remove the note from the array
      notes.splice(index, 1);
  
      // Write the updated array back to the file
      fs.writeFile("./db/db.json", JSON.stringify(notes), (error) => {
        if (error) {
          return res.status(500).json({ error: 'Error writing file with deleted note' });
        }
        // Respond with a success message
        res.json({ message: 'Note deleted successfully' });
      });
    });
  });

  module.exports = notes;