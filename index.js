const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const run = require('nodemon/lib/monitor/run');

const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://voluter:nMohzO02MsTL6nSx@cluster0.ciudb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function runing(){
    try{
        await client.connect();
        const serviceCollection = client.db('volunter').collection('services');


        // get api
        app.get('/service', async(req,res) =>{
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray()
            res.send(result)

        })
    }
    finally{

    }
}

runing().catch(console.dir);

app.get('/', (req, res) => {
    res.send('volunter server is running')
})

app.listen(port,()=>{
    console.log("crud operation is running");
})