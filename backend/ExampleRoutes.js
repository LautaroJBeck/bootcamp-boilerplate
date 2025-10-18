import express from "express";
import { getDb } from "./ExampleConnect.js";
import { ObjectId } from "mongodb";

let expressRouter = express.Router();

expressRouter.route("/").get(async (request, response) => {
  let db = getDb();
  let data = await db.collection("pets").find({}).toArray();
  if (data.length > 0) {
    response.json(data);
  } else {
    console.log(response);
    throw new Error("Notes data not found.");
  }
});

expressRouter.route("/:id").get(async (request, response) => {
  let db = getDb();
  let data = await db
    .collection("pets")
    .findOne({ _id: new ObjectId(request.params.id) });
  if (Object.keys(data).length > 0) {
    response.json(data);
  } else {
    throw new Error("Note data not found.");
  }
});

expressRouter.route("/").post(async (request, response) => {
  let db = getDb();
  let mongoObject = {
    name: request.body.name,
    breed: request.body.breed,
    age: request.body.age,
    url: request.body.url,
  };
  let data = await db.collection("pets").insertOne(mongoObject);
  response.json(data);
});

expressRouter.route("/:id").put(async (request, response) => {
  let db = getDb();
  let mongoObject = {
    $set: {
      name: request.body.name,
      breed: request.body.breed,
      age: request.body.age,
      url: request.body.url,
    },
  };
  let data = await db
    .collection("pets")
    .updateOne({ _id: new ObjectId(request.params.id) }, mongoObject);
  response.json(data);
});

expressRouter.route("/:id").delete(async (request, response) => {
  let db = getDb();
  let data = await db
    .collection("pets")
    .deleteOne({ _id: new ObjectId(request.params.id) });
  response.json(data);
});

export default expressRouter;
