//Q1 How many tweets are not retweets or replies?
//Script for Q1 either in MongoShell or Node

const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const collection = db.collection("tweet");

    const count = await collection.countDocuments({
      retweeted_status: { $exists: false },
      in_reply_to_status_id: null
    });

    console.log("Tweets that are NOT retweets or replies:", count);
  } catch (error) {
    console.error("Error in Query1:", error);
  } finally {
    await client.close();
  }
}

main();