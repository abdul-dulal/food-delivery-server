const express = require("express");
const app = express();
const port = process.env.PROT || 4000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://redOnion:ff7rq0uKM0kL9zMm@cluster0.meqez.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const mealCollection = client.db("redOnion").collection("meal");

    app.get("/meal", async (req, res) => {
      const meal = await mealCollection.find().toArray();
      res.send(meal);
    });

    app.get("/meal/:id", async (req, res) => {
      const id = req.params._id;
      const result = await mealCollection.findOne({ id });
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
