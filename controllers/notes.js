// Import note model and current date script
var Note = require("../models/Note");
var makeDate = require("../scripts/date");

module.exports = {
    // Retrive notes from collection
    get: function(data, cb) {
        Note.find({
            _headlineId: data._id
        }, cb);
    },
    // Save a new note to the collection
    save: function(data, cb) {
        // Store user input
        var newNote = {
            _headlineId: data._id,
            date: makeDate(),
            noteText: data.noteText
        };
        // Create a new note in the collection
        Note.create(newNote, function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
                cb(doc);
            }
        });
    },
    // Delete a note
    delete: function(data, cb) {
        Note.remove({
            _id: data._id
        }, cb);
    }
};