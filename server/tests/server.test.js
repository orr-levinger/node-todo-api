const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


beforeEach((done)=>{
    Todo.remove({}).then(()=>{
            done();
        })
});

describe('POST/ todos', ()=>{

    it('should create new TODO', (done)=>{
        const text = 'new todo';

        request(app).
            post('/todos').
            send({text}).
            expect(200).
            expect((res)=>{
            expect(res.body.text).toBe(text);
        }).end((err,res)=>{
            if(err){
                done(err);
            }else{
                Todo.find({text:'new todo'}).then((doc)=>{
                    expect(doc.length).toBe(1);
                    expect(doc[0].text).toBe(text);
                    done();
                }).catch((e)=>{
                    done(e);
                });
            }
        })


    });


    it('should not create new TODO with invalid data', (done)=>{

        request(app).
        post('/todos').
        send({}).
        expect(400).end(done());


    })

});
