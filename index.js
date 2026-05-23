//For mongodb DNS error
// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// a mandatory express permission
app.use(express.json());

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

//bellow this are comming from mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Get the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Created a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // TODO: Comment this line before deploying the app to production
    await client.connect();

    const db = client.db("Doc_Appoint");
    const doctorCollection = db.collection("doctor_appointments");
    const bookingsCollection = db.collection("bookings");

    app.get('/doctor-appointments', async (req, res) => {
        const doctors = await doctorCollection.find().toArray();
        res.json(doctors);
    });

    app.get('/doctor-appointments/:id', async (req, res) => {
        const id = req.params; 
        const doctors = await doctorCollection.findOne({ _id: new ObjectId(id) });
        
        res.json(doctors); 
    });

    // app.get('/booking/:userId', async (req, res) => {
    //     const userId = req.params.userId;
    //     const bookings = await bookingsCollection.find({ userId: userId }).toArray();
    //     res.json(bookings); // Send the list of bookings as a JSON response
    // });

    app.patch('/destination/:id', async (req, res) => {
        const id = req.params; // Get the destination ID from the URL parameters
        const updateData = req.body; // Extract ID and update data from request body
        const result = await destinationsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        // console.log(updateData);
        res.json(result); // Send the result of the update back to the client
    });

    app.delete('/destination/:id', async (req, res) => {
        const id = req.params; // Get the destination ID from the URL parameters
        const result = await destinationsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result); // Send the result of the deletion back to the client
    });

    app.delete('/booking/:id', async (req, res) => {
        const id = req.params; // Get the booking ID from the URL parameters
        const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
        res.json(result); // Send the result of the deletion back to the client
    });

    app.post('/destination', async (req, res) => {
        const destinationData = req.body; // Assuming the destination data is sent in the request body
        // console.log(destinationData); // it will show in the terminal**
        const result = await destinationsCollection.insertOne(destinationData);
        res.json(result); // Send the result of the insertion back to the client
    });

    app.post('/booking', async (req, res) => {
        const bookingData = req.body; // Assuming the booking data is sent in the request body
        const result = await bookingsCollection.insertOne(bookingData);
        res.json(result); // Send the result of the insertion back to the client
    });



    // Send a ping to confirm a successful connection
    // TODO: Comment this before deploying the app to production
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// This is a API route that    sends "Server is running well!" as a response when the root URL is accessed.
app.get('/', (req, res) => { 
  res.send('Server is running well!'); // Send a response to the client
});

app.listen(port, () => { // This starts the server .
  console.log(`This app listening at http://localhost:${port}`);
});