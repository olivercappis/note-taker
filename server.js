const express = require('express');
const path = require('path');
const data = require('./db/db.json')
const fs = require('fs');
const uuid = require('./helpers/uuid')


const PORT = 3001;

const app = express();



// Middleware for parsing application/json and urlencoded data
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'notes.html')))

app.get('/api/notes', (req, res) => {
    console.log('GET request received at /api/notes');
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        const notes = JSON.parse(data)
        return res.json(notes)
    })
})

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} request received to add a review`);

    const { title, text } = req.body

    if (title && text) {
        newNote = {
            title,
            text,
            id: uuid()
        }
    }


    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
        if (err) {
            console.log(err)
        } else {
            const parsedNotes = JSON.parse(data)

            parsedNotes.push(newNote)

            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (writeErr) => writeErr ? console.log(writeErr) : console.log('successfully wrote'))
            res.status(201).json(parsedNotes)
        }
    })
})





app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'index.html')))

app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);

