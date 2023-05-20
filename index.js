const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app=express();
require('dotenv').config();

const port=process.env.PORT || 5000;

app.use(express.json());
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.njebycd.mongodb.net/?retryWrites=true&w=majority`
// console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const categoryCollection= client.db('kawaidb').collection('categories')
    const toyCollection= client.db('kawaidb').collection('toy')

    app.post('/addtoy', async(req,res)=>{
      const data=req.body;
      const result= await toyCollection.insertOne(data);
      res.send(result)
      })


    
  } 
  finally {
    
  }
}
run().catch(error=>console.error(error));


app.get('/', (req, res)=>{
    res.send('server is running')
});

app.listen(port,()=>{
console.log(`Server is running on port ${port}`);
})