const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

todos = [
    {
        _id: new ObjectID(),
        text: "first todo"
    },
    {
        _id: new ObjectID(),
        text: "secod todo",
        completed: true,
        completedAt: 333
    }
];



beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);

    }).then(done());
});

describe('POST/ todos', () => {

    it('should create new TODO', (done) => {
        const text = 'new todo';

        request(app).
        post('/todos').
        send({text}).
        expect(200).
        expect((res) => {
            expect(res.body.text).toBe(text);
        }).end((err, res) => {
            if (err) {
                done(err);
            } else {
                Todo.find({text: 'new todo'}).then((doc) => {
                    expect(doc.length).toBe(1);
                    expect(doc[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                });
            }
        })


    });


    it('should not create new TODO with invalid data', (done) => {

        request(app).
        post('/todos').
        send({}).
            expect(400).end(done());


    })

});


describe('GET/ todos', () => {

    it('should get all todos', (done) => {
        request(app).
        get('/todos').
        expect(200).
        expect((res) => {
            expect(res.body.todos.length).toBe(2);
        }).
        end(done);

    });


});
describe('GET/ todo by id', () => {

    it('should get todo by id', (done) => {
        request(app).
        get(`/todos/${todos[0]._id.toHexString()}`).
        expect(200).
        expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        }).
        end(done);

    });



    it('should get 404 for invalid id', (done) => {
        request(app).
        get(`/todos/${new ObjectID().toHexString()}`).
        expect(404).
        end(done);

    });
});


describe('DELETE/ todo by id', () => {

    it('should get todo by id', (done) => {
        request(app).
        delete(`/todos/${todos[0]._id.toHexString()}`).
        expect(200).
        expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        }).
        end(done);

    });

    it('should get 404 for invalid id', (done) => {
        request(app).
        delete(`/todos/${new ObjectID().toHexString()}`).
        expect(404).
        end(done);

    });

});

describe('PATCH/ todos/:id', () => {

    it('should update the todo', (done) => {
        const body = {
            _id: new ObjectID(),
            text: "first todo completed",
            completed: true
        };
        request(app).
        patch(`/todos/${todos[0]._id.toHexString()}`).
        send(body).
        expect(200).
        expect((res)=>{
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        }).
        end(done);

    });

    it('should clear completed at when todo is not completed', (done) => {
        const body = {
            _id: new ObjectID(),
            text: "second todo completed",
            completed: false
        };
        request(app).
        patch(`/todos/${todos[1]._id.toHexString()}`).
        send(body).
        expect(200).
        expect((res)=>{
            expect(res.body.todo.text).toBe(body.text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        }).
        end(done);

    });
});