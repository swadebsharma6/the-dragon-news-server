const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fikwith.mongodb.net/?retryWrites=true&w=majority`;

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
    const db = client.db("dragon_news");
    const categoriesCollection = db.collection("categories");
    const newsCollection = db.collection("news");
    // get all news
    app.get("/all-news", async (req, res) => {
      const allNews = await newsCollection.find({}).toArray();
      res.send({ status: true, message: "success", data: allNews });
    });

    // get specific news
    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      const news = await newsCollection.findOne({ _id: new ObjectId(id) });
      res.send({ status: true, message: "success", data: news });
    });

    // get all categories
    app.get("/categories", async (req, res) => {
      const categories = await categoriesCollection.find({}).toArray();
      res.send({ status: true, message: "success", data: categories });
    });

    // get specific categories
    app.get("/news", async (req, res) => {
      const name = req.query.category;
      let newses = [];
      if (name == "all-news") {
        newses = await newsCollection.find({}).toArray();
        return res.send({ status: true, message: "success", data: newses });
      }
      newses = await newsCollection
        .find({ category: { $regex: name, $options: "i" } })
        .toArray();
      res.send({ status: true, message: "success", data: newses });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Dragon News is running')
})

app.listen(port, () => {
  console.log(`Dragon News is running on port ${port}`)
})