//Q3: Who is the person that got the most tweets?
//Script either in MongoShell or Node

const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const collection = db.collection("tweet");

    const results = await collection.aggregate([
      { $unwind: "$entities.user_mentions" },
      {
        $group: {
          _id: "$entities.user_mentions.id",
          screen_name: { $first: "$entities.user_mentions.screen_name" },
          mention_count: { $sum: 1 }
        }
      },
      { $sort: { mention_count: -1 } },
      { $limit: 1 }
    ]).toArray();

    if (results.length > 0) {
      console.log("Person who got the most tweets (most mentions):");
      console.log(`${results[0].screen_name} - ${results[0].mention_count} mentions`);
    } else {
      console.log("No mentions found.");
    }
  } catch (error) {
    console.error("Error in Query3:", error);
  } finally {
    await client.close();
  }
}

main();