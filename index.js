const express = require("express");
const app = express();
const port = process.env.PROT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const cartCollection = client.db("redOnion").collection("cart");

    app.get("/meal", async (req, res) => {
      const meal = await mealCollection.find().toArray();
      res.send(meal);
    });

    app.get("/meal/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await mealCollection.findOne(query);
      res.send(result);
    });

    // put cart
    app.post("/addCart", async (req, res) => {
      const cart = req.body;

      const query = {
        name: cart.name,
        email: cart.email,
      };
      const exist = await cartCollection.findOne(query);
      if (exist) {
        return res.send({ success: false, addcart: exist });
      }
      const result = await cartCollection.insertOne(cart);
      res.send({ success: true, result });
    });

    app.get("/order", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const result = await cartCollection.find(query).toArray();

      res.send(result);
    });

    // delete order
    app.delete("/deleteorder/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(filter);
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
