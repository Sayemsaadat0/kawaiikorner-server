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
    // Add to data toy collection
    const toyCollection= client.db('kawaidb').collection('toy')



    const subCatName= client.db('kawaidb').collection('subCategoryName')
    const subcatdetails= client.db('kawaidb').collection('subCategoryDetails')


   
        
    // post for add  a  toy
    app.post('/addtoy', async(req,res)=>{
      const addData =req.body;
      const result= await toyCollection.insertOne(addData);
      res.send(result)
      })


   // show all toy to the alltoy page what we addeded in add a toy page
   app.get('/addtoy', async (req, res)=>{
    console.log(req.query)
     let query = {}
    if(req.query?.email){
      query = {email: req.query.Seller_email} } 
    const result = await toyCollection.find(query).toArray()
    res.send(result)
          })
    


      // sub category 
      app.get('/subToy', async(req, res)=>{
        console.log(req.query)
        const cursor = subCatName.find() 
        const result = await cursor.toArray()
        res.send(result)
      })

      app.get('/subtoy/:name' , async (req , res ) => {
        const name=req.query.name
        const query= {name: name}
        const result =await categoryDetailsCollection.find(query).toArray()
        res.send(result)
      })








     await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    
  }
}
run().catch(error=>console.error(error));


app.get('/', (req, res)=>{
    res.send('kawai is running at 5000')
});

app.listen(port,()=>{
console.log(`Server is running on port ${port}`);
})