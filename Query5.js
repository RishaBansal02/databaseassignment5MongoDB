//Q5: Separates the User Collection 
//Write the instructions that will separate the Users information into a different collection
//Create a user collection that contains all the unique users.
//Create a new Tweets_Only collection, that doesn't embed the user information, but instead references it using the user id


const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db("ieeevisTweets");
    const tweets = db.collection("tweet");

    // Optional: clear old collections if they already exist
    const collections = await db.listCollections().toArray();
    const names = collections.map(c => c.name);

    if (names.includes("users")) {
      await db.collection("users").drop();
    }

    if (names.includes("Tweets_Only")) {
      await db.collection("Tweets_Only").drop();
    }

    // Step 1: create users collection with unique users
    await tweets.aggregate([
      {
        $group: {
          _id: "$user.id",
          user: { $first: "$user" }
        }
      },
      {
        $replaceRoot: { newRoot: "$user" }
      },
      {
        $out: "users"
      }
    ]).toArray();

    // Step 2: create Tweets_Only collection without embedded user object
    await tweets.aggregate([
      {
        $project: {
          _id: 1,
          created_at: 1,
          id: 1,
          id_str: 1,
          full_text: 1,
          text: 1,
          source: 1,
          truncated: 1,
          in_reply_to_status_id: 1,
          in_reply_to_user_id: 1,
          in_reply_to_screen_name: 1,
          retweet_count: 1,
          favorite_count: 1,
          entities: 1,
          lang: 1,
          retweeted_status: 1,
          user_id: "$user.id"
        }
      },
      {
        $out: "Tweets_Only"
      }
    ]).toArray();

    const userCount = await db.collection("users").countDocuments();
    const tweetOnlyCount = await db.collection("Tweets_Only").countDocuments();

    console.log("users collection created.");
    console.log("Tweets_Only collection created.");
    console.log("Unique users:", userCount);
    console.log("Tweets_Only documents:", tweetOnlyCount);
  } catch (error) {
    console.error("Error in Query5:", error);
  } finally {
    await client.close();
  }
}

main();