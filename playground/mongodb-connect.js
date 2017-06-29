const {MongoClient, ObjectID} = require('mongodb');



new ObjectID('a');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('failed to connect to mongodb');
    }
    console.log('connected to mongodb');
    mongo = db;
    db.collection('Todos').insertOne({
            text: 'something to do',
            done: false
        },
        (err, res) => {
            if (err) {
                console.log('unable to insert record', err);
            } else {
                console.log('insert record successfully');
            }
        });

    db.close();
});

