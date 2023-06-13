const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const addClsCollection = client.db('drawing-art').collection('addClsCollecton')
    const userCollection = client.db('drawing-art').collection('userCollection')

    app.post('/users', async(req,res) => {
      const user = req.body;
      const query = { userEmail:user.userEmail}
      const exestingUser = await userCollection.findOne(query)
      if(exestingUser){
        return res.send({message:'user allready added'})
      }
      const result =await userCollection.insertOne(user);
      res.send(result)
    })

    app.get('/users',async(req,res) => {
      const result = await userCollection.find().toArray();
      res.send(result)
    })

    app.patch('/users/admin/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set:{
          role:'admin'
        }
      }
      const result = await userCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })

    app.patch('/users/instructor/:id',async(req,res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateDoc = {
        $set:{
          role:'instructor'
        }
      }
      const result = await userCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })

    app.get('/class',async(req,res) => {
      const result = await classCollection.find().limit(6).sort({available:1}).toArray()
      res.send(result)
    })

    app.post('/class',async(req,res) => {
      const data = req.body;
      if(data.status === 'pending'){
        return res.send({message:'this class is pending'})
      }
      const result = await classCollection.insertOne(data);
      res.send(result)
    })

    app.get('/allclass',async(req,res) => {
      const result = await classCollection.find().toArray()
      res.send(result)
    })

    app.post('/addcls',async (req,res) => {
      const cls = req.body;
      const result = await addClsCollection.insertOne(cls)
      res.send(result)

    })



    app.get('/myclass',async(req,res) => {
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {email : email}
      const result = await classCollection.find(query).toArray()
      res.send(result)
    })


    app.get('/addcls',async(req,res) => {
      const email = req.query.email;
      if(!email){
        res.send([])
      }
      const query = {userEmail : email}
      const result = await addClsCollection.find(query).toArray()
      res.send(result)
    })

  app.delete('/addclass/:id',async(req,res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await addClsCollection.deleteOne(query)
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