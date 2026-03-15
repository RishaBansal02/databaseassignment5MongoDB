const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const collection = db.collection("tweet");

    const results = await collection.aggregate([
      {
        $group: {
          _id: "$user.id",
          screen_name: { $first: "$user.screen_name" },
          followers_count: { $max: "$user.followers_count" }
        }
      },
      { $sort: { followers_count: -1 } },
      { $limit: 10 }
    ]).toArray();

    console.log("Top 10 screen_names by followers:");
    results.forEach((doc, index) => {
      console.log(
        `${index + 1}. ${doc.screen_name} - ${doc.followers_count} followers`
      );
    });
  } catch (error) {
    console.error("Error in Query2:", error);
  } finally {
    await client.close();
  }
}

main();