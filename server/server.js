const env = process.env.NODE_ENV || 'development';

if(env === 'test'){
    process.env.MONGODB_URI='mongodb://localhost:27017/TodoAppTest';
}else if(env === 'development'){
    process.env.MONGODB_URI='mongodb://localhost:27017/TodoApp';
}


const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {_} = require('lodash');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3001;
app.listen(port);



app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }).catch((e) => {
        res.status(400).send(e);
    })
});


app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text','completed']);
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    } else{

        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        }else{
            body.completedAt = null;
            body.completed = false;
        }
        Todo.findByIdAndUpdate(id,{$set: body},{new : true}).then((todo)=>{
            if(!todo){
                res.status(404).send();
            }else{
                res.send({todo});
            }
        }).catch((e)=>{
            res.status(400).send(e);
        })
    }


});


app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    } else {
        Todo.findByIdAndRemove(id).then((todo) => {
            if (!todo) {
                res.status(404).send();
            } else {
                res.send({todo});
            }
        }).catch((e) => {
            res.status(400).send(e);
        })
    }
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    } else {
        Todo.findById(id).then((todo) => {
            if (!todo) {
                res.status(404).send();
            } else {
                res.send({todo});
            }
        }).catch((e) => {
            res.status(400).send(e);
        })
    }
});


module.exports = {app};
