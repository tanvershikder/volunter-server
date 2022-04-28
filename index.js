const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const res = require('express/lib/response');
const { emit } = require('nodemon');
require('dotenv').config();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ciudb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('volunter').collection('services');


        // get api
        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray()
            res.send(result)

        })


        //post api
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const tokenInfo = req.headers.authorization; // get genrate token from client site

            const [email, accessToken] = tokenInfo.split(" ")
            // console.log(accessToken);

            const decoded = verfyToken(accessToken)
            console.log(decoded.email);

            if (email !== decoded.email) {
               
                 res.send({success:"unAuthorized user"})
            }
            else{
                const result = await serviceCollection.insertOne(newService)
                res.send({success:"service add successfully"})
            }


        })

        // for jwt token jenarate and send generate token to client site 
        app.post('/login', async (req, res) => {
            const email = req.body;;

            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
            // console.log(token);
            res.send({ token: token })
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('volunter server is running')
})

app.listen(port, () => {
    console.log("crud operation is running");
})

const verfyToken = (token) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            email = 'invalid email'
        }
        if (decoded) {

            console.log(decoded);
            email = decoded;
        }
    });
    return email;
}