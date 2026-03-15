//Q4: Who are the top 10 people that got more retweets in average, after tweeting more than 3 times
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
      {
        $match: {
          retweeted_status: { $exists: false }
        }
      },
      {
        $group: {
          _id: "$user.id",
          screen_name: { $first: "$user.screen_name" },
          tweet_count: { $sum: 1 },
          avg_retweets: { $avg: "$retweet_count" }
        }
      },
      {
        $match: {
          tweet_count: { $gt: 3 }
        }
      },
      {
        $sort: {
          avg_retweets: -1
        }
      },
      {
        $limit: 10
      }
    ]).toArray();

    console.log("Top 10 users by average retweets, with more than 3 tweets:");
    results.forEach((doc, index) => {
      console.log(
        `${index + 1}. ${doc.screen_name} | tweets: ${doc.tweet_count} | avg retweets: ${doc.avg_retweets.toFixed(2)}`
      );
    });
  } catch (error) {
    console.error("Error in Query4:", error);
  } finally {
    await client.close();
  }
}

main();