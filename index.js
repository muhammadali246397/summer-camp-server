const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.POST || 5000;

app.use(cors());
app.use(express.json())

app.get('/',(req,res) => {
    res.send('assignment twelve is runing')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfaan6v.mongodb.net/?retryWrites=true&w=majority`;

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
    const classCollection = client.db('drawing-art').collection('classesCollection')

    app.get('/class',async(req,res) => {
      const result = await classCollection.find().sort({available:-1}).toArray()
      res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port,() => {
    console.log(`assignment twelve is runing port on ${port}`)
})