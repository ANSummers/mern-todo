import mongoose from "mongoose";

export async function createMongoConnectionFromEnv() {
  const username = process.env.MONGO_USERNAME;
  const password = process.env.MONGO_PASSWORD;
  const cluster = process.env.MONGO_CLUSTER;
  const db = process.env.MONGO_DB;
  if (!username || !password || !cluster || !db) {
    throw new Error("Some mongodb configs are not set.");
  }
  // opts copied from Atlas
  const opts = "?retryWrites=true&w=majority";
  const uri = `mongodb+srv://${username}:${password}@${cluster}/${db}${opts}`;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return;
  } catch (e) {
    throw new Error("Couldn't connect to mongodb: " + e);
  }
}
