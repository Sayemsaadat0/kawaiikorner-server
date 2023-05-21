const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const galarry = require('./Data/Gallary.json');
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
     client.connect();


    // const categoryCollection= client.db('kawaidb').collection('categories')
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
    // console.log(req.query?.Seller_email)
     let query = {}
  
   if(req.query?.email){
      query = {Seller_email: req.query.email} } 
    const result = await toyCollection.find(query).limit(20).toArray()
    res.send(result)
          })


 

  //  search toyCollection

  app.get('/search', async (req, res) => {
    const toyName = req.query.toyName;
    const query = { toyName: toyName };
    const result = await toyCollection.find(query).toArray();
    res.send(result);
});

app.get('/toyData/:id', async(req, res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result=await toyCollection.findOne(query);
  res.send(result);
})

   
// deelete
app.delete('/addtoy/:id', async(req, res)=>{
  const id = req.params.id
  const query = {id_ : new ObjectId(id)}
  const result = await toyCollection.deleteOne(query)
  res.send(result)

})


// update 
app.patch('/updateToy/:id', async(req, res)=>{
  const id = req.params.id 
  const filter = { _id: new ObjectId(id)}
  const data = req.body;
  const option= {upsert:true};
  const updateDoc = {
    $set: {
    status : data.status
    },
  };
console.log(data)
const result = await toyCollection.updateOne(filter,updateDoc,option )
res.send(result)
})




            



      // sub category 
      app.get('/subToy', async(req, res)=>{
        const query = {}
        const result = await subCatName.find(query).toArray()
        res.send(result)
      })

      app.get('/category' , async (req , res ) => {
        const sub_category=req.query.sub_category
        const query= {sub_category : sub_category} 

        const result =await subcatdetails.find(query).toArray()
        res.send(result)
      })



     await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    
  }
}
run().catch(error=>console.error(error));

app.get('/gallary', (req,res)=>{
  res.send(galarry)
  })


app.get('/', (req, res)=>{
    res.send('kawai is running at 5000')
});

app.listen(port,()=>{
console.log(`Server is running on port ${port}`);
})