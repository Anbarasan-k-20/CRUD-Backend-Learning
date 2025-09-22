// express intialization
const express = require("express");
// import mongoose
const mongoose = require("mongoose");
// import cors
const cors = require("cors");
// create instance
const app = express();
app.use(express.json());
app.use(cors());
port = 4000;

// graph ql

// connecting MongoDb
mongoose
  .connect("mongodb://localhost:27017/api-learning")
  .then(() => {
    console.log("Db connected ");
  })
  .catch((err) => {
    console.log(err);
  });

// creating schema

const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: String,
});

// creating a New Todo model
const todoModel = mongoose.model("Todo", todoSchema);

// post method

app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// get all the todo items

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// update the Todo item

app.put("/todos/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedList = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedList) {
      return res.status(404).json({ message: "Todo not Found" });
    }
    res.json(updatedList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete the todo list

app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).json({ message: "todo deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// //listening

app.listen(port, () => {
  console.log(`server is running ${port}`);
});
