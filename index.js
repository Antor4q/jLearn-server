const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8hseoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const lessonsCollections = client.db("jLearnDB").collection("lessons")
    const usersCollections = client.db("jLearnDB").collection("users")
    const vocabulariesCollections = client.db("jLearnDB").collection("vocabularies")

    app.get("/lessons", async(req,res)=>{
        const result =  await lessonsCollections.find().toArray()
        res.send(result)
    })

    app.post("/lesson", async(req,res)=>{
        const data = req.body
        const result = await lessonsCollections.insertOne(data)
        res.send(result)
    })

    app.delete("/lesson-del/:id", async(req,res)=>{
        const id = req.params
        const query = {_id: new ObjectId(id?.id)}
        const result = await lessonsCollections.deleteOne(query)
        res.send(result)
    })

    
    app.patch('/lesson-update/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const updatedData = req.body;
                const query = { _id: new ObjectId(id) };
                const update = { $set: updatedData };
                const result = await lessonsCollections.updateOne(query, update, { upsert: true });
                res.status(200).send(result);
            } catch (error) {
                res.status(500).json({ message: 'Failed to update lesson', error: error.message });
            }
        });

    // users all api

    app.get("/users", async(req,res) =>{
        const result = await usersCollections.find().toArray()
        res.send(result)
    })

    app.delete("/user-del/:id", async(req,res)=>{
        const id = req.params
        const query = {_id: new ObjectId(id?.id)}
        const result = await usersCollections.deleteOne(query)
        res.send(result)
    })

    app.patch("/user-role/:id", async (req, res) => {
        const id = req.params.id;
        const { role } = req.body;
        const filter = { _id: new ObjectId(id) };
        const update = { $set: { role } };
        const result = await usersCollections.updateOne(filter, update);
        res.send(result);
      });

    //  vocabularies api
    app.get("/vocabularies", async(req,res) =>{
        const result = await vocabulariesCollections.find().toArray()
        res.send(result)
    })

    app.post("/vocabulary", async(req,res)=>{
        const data = req.body
        const result = await vocabulariesCollections.insertOne(data)
        res.send(result)
    })

    app.delete("/vocabulary-del/:id", async(req,res)=>{
        const id = req.params
        const query = {_id: new ObjectId(id?.id)}
        const result = await vocabulariesCollections.deleteOne(query)
        res.send(result)
    })

    app.patch("/vocabulary-update/:id", async (req, res) => {
        const id = req.params.id;
        const updatedVocabulary = req.body;
        const query = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: updatedVocabulary,
        };
        const result = await vocabulariesCollections.updateOne(query, updateDoc);
        res.send(result);
      });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
 res.send("JLearn server is running")
})

app.listen(port, ()=> {
    console.log(`Snap Net is running on post ${port}`)
})
