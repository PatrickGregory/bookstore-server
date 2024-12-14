const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require ('dotenv')
dotenv.config()


const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
}

const bookstoreSchema = new mongoose.Schema({
    bookTitle: String,
    authorName: String,
    imageUrl: String,
    category: String,
    description: String,
    bookPdfUrl: String,
    price: Number,
  });
  const  bookModel = mongoose.model('book', bookstoreSchema);

  app.post('/upload-book', async(req,res)=>{
    const data = req.body;
    await bookModel.create(data)
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
  })

  //get all books
  app.get('/all-books', async(req,res)=>{
    await bookModel.find({})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
  })

  // get books by category
  app.get('/booksByCategory/:category', async(req,res)=>{
    const category = req.params.category;
    await bookModel.find({ category: category})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
  })

  // get books by category1
  app.get('/books-by-category/:category', async (req, res)=>{
    const category = req.params.category;
    const result = await bookModel.find({category:category})
    if (!result) {
      res.status({message: 'category not found'});
    }else{
      res.json(result)
      // return res.json(result);
    }
    //else {
    //.then(result=>res.json(result))
    //.catch(err=>res.json(err))}
  })

  // find book by id
  app.get('/book/:id',async(req,res)=>{
    const id = req.params.id;
    const result = await bookModel.findById({_id:id})
    if(!result){
      return res.json({message:"Book id not found"});
    }
    res.json(result);
    // .then(result=>res.json(result))
    // .catch(err=>res.json(err))
  })

  // update book by id
  app.put('/book/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    await bookModel.findByIdAndUpdate({_id:id}, data, {new: true})
    .then(result=>res.json(result))
    .catch(err=>res.json(err))
  })

  // delete book
  app.delete('/book/:id', async (req,res) =>{
    const id = req.params.id;
    // if(id !== _id){
    //   return res.err("Book not found")
    // }
    await bookModel.findByIdAndDelete({_id:id})
    .then(message=>res.json({message:"record deleted"}))
    .catch(err=>res.json(err))
  })

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })