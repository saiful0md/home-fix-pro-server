const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()

// middleware
app.use(cors({
    origin: ['http://localhost:5173']
}));
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
        const bookingColection = client.db('homeFixPro').collection('booking');

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

        // get data from email
        app.get('/services/:email', async (req, res) => {
            const email = req.params.email
            const query = { 'serviceProvider.email': email }
            const result = await servicesColection.find(query).toArray()
            res.send(result)
        })
        // delete data by id
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await servicesColection.deleteOne(query)
            res.send(result)
        })
        // update data by id
        app.put('/service/:id', async (req, res) => {
            const serviceData = req.body
            const query = { _id: new ObjectId(req.params.id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...serviceData
                },
            };
            const result = await servicesColection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        // post service
        app.post('/service', async (req, res) => {
            const serviceData = req.body;
            console.log(serviceData);
            const result = await servicesColection.insertOne(serviceData);
            res.send(result)
        })

        // post booking data
        app.post('/booking', async (req, res) => {
            const bookingData = req.body;
            const result = await bookingColection.insertOne(bookingData);
            res.send(result)
        })
        // get booking by user email
        app.get('/booking/:email', async (req, res) => {
            const email = req.params.email
            const query = { userEmail: email }
            result = await bookingColection.find(query).toArray();
            res.send(result)
        })
        // get booking by user email
        app.get('/serviceToDo/:email', async (req, res) => {
            const email = req.params.email
            const query = { 'serviceProvider.email': email }
            result = await bookingColection.find(query).toArray();
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




