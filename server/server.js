const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
app.use(bodyParser.json());
app.listen(3001);

app.post('/todos',(req,res)=>{
   const todo = new Todo({
       text: req.body.text
   });
   todo.save().then((doc)=>{
        res.send(doc);
   }).catch((e)=>{
       res.status(400).send(e);
   })
});


app.get('/todos',(req,res)=>{
    Todo.find().then((doc)=>{
        res.send(doc);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});



module.exports = {app};
