const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('this is assignment 11')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xes5bsh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const servicesColection = client.db('homeFixPro').collection('services');

        // get allServices
        app.get('/services', async (req, res) => {
            const result = await servicesColection.find().toArray();
            res.send(result)
        })
        // get single sevice of id
        app.get('/service/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            result = await servicesColection.findOne(query);
            res.send(result)
        })
        // post service
        app.post('/service',async(req, res)=>{
            const serviceData = req.body;
            console.log(serviceData);
            const result = await servicesColection.insertOne(serviceData);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('this server is runnig port:', port);
})



  
