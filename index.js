const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

// midlewire
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.TOY_USER}:${process.env.SECRET_TOY}@cluster0.7ct1cb2.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const toydatabase = client.db("bdtoyDB").collection("toys");
        const fackdatatoy = client.db("bdToygor").collection("bdtoy");


        const indexKeys = {name: 1, catagory: 1};
        const indexOptions = {name: "catagoryname"};

        // const result = await toydatabase.createIndex(indexKeys,indexOptions)

        app.get('/searchname/:text', async(req, res)=>{
            const searchtext = req.params.text;
            const result = await toydatabase.find({
                $or: [
                    {name: {$regex: searchtext, $options: "i"}},
                    
                ]
            }).toArray()
            res.send(result)
        })


        app.post('/add', async (req, res) => {
            const body = req.body;
            console.log(body)
            const result = await toydatabase.insertOne(body);
            res.send(result)
        })


        app.get('/add', async (req, res) => {
            const query = {}
            const cursor = toydatabase.find(query).limit(20)
            const result = await cursor.toArray()
            res.send(result)
        })

        


        // app.get('/toydata/:id', async(req,res)=>{
        //     const id = req.params.id;
        //     console.log(id)
        //     // const value = JSON.stringify(id)
        //     const query = {_id: new ObjectId(id)}
        //     const result = await fackdatatoy.findOne(query)
        //     res.send(result)
        // })

       app.get('/add/:email', async(req, res)=>{
        console.log(req.params.email)
        const result = await toydatabase.find({email: req.params.email}).toArray()
        res.send(result)
       })

        app.get('/toydata/:text', async(req, res)=>{
            console.log(req.params.text)
            
            if(req.params.text == 'car toy' || req.params.text == 'bus toy' || req.params.text == 'semi bus toy'){
                const result = await fackdatatoy.find({catagory: req.params.text}).sort({price:-1}).toArray()
                console.log(result)
                return res.send(result)
            }
            const result = await fackdatatoy.find({}).toArray();
            res.send(result)
        })


        app.get('/add/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await toydatabase.findone(query)
            res.send(result)
        })

        app.put('/add/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedtoy = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const doc ={
                    $set:{
                        price: updatedtoy.price,
                        quantity: updatedtoy.quantity,
                        discription: updatedtoy.discription,
                        date: updatedtoy.date
                    }
            }
            const result = await toydatabase.updateOne(filter, doc, options);
            res.send(result)
        })

       

        app.delete('/add/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toydatabase.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('toy server is runninig')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})