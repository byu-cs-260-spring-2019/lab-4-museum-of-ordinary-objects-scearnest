

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);


// var admin = require("firebase-admin");

// var serviceAccount = require("../cs260midterm-firebase-adminsdk-dm4fk-ac506b2feb.json");
//
// firebase.initializeApp({
//   credential: firebase.credential.cert(serviceAccount),
//   databaseURL: "https://cs260midterm.firebaseio.com"
// });


const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.get('/hello', (req, res) => {
  res.send('Hello world!');
});

var db = firebase.firestore();
var itemsRef = db.collection('items');

app.post('/api/items', async (req, res) => {
    try {
        let querySnapshot = await itemsRef.get();
        let numRecords = querySnapshot.docs.length;
        let index = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // if(numRecords > 0)
        // {
        //   let index = querySnapshot.docs[numRecords - 1].id;
        // }
        // else
        // {
        //   let index = 0;
        // }
        console.log(req.body);
        let item = {
            id: index,
            title: req.body.title,
            description: req.body.description,
            path: req.body.path
        };
        itemsRef.doc(item.id.toString()).set(item);
        res.send(item);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.get('/api/items', async (req, res) => {
    try{
        let querySnapshot = await itemsRef.get();
        res.send(querySnapshot.docs.map(doc => doc.data()));
    }catch(err){
        res.sendStatus(500);
    }
});

app.delete('/api/items/:id', async (req, res) => {
  let id = req.params.id.toString();
    var documentToDelete = itemsRef.doc(id);
    try{
        var doc = await documentToDelete.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else{
            documentToDelete.delete();
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
});

app.put('/api/items/:id', async (req, res) => {
  let id = req.params.id.toString();
    var documentToEdit = itemsRef.doc(id);
    try{
        var doc = await documentToEdit.get();
        if(!doc.exists){
            res.status(404).send("Sorry, that item doesn't exist");
            return;
        }
        else{
            documentToEdit.update({
              title: req.body.title,
              description: req.body.description,
            });
            res.sendStatus(200);
            return;
        }
    }catch(err){
        res.status(500).send("Error deleting document: ",err);
    }
})


exports.app = functions.https.onRequest(app);
