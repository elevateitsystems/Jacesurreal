const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function checkSizes() {
  const client = new MongoClient(process.env.DB_URL);
  try {
    await client.connect();
    const db = client.db();
    const tracks = await db.collection('tracks').find({}).toArray();
    
    tracks.forEach(t => {
      const audioSize = t.audioUrl ? (t.audioUrl.length / 1024 / 1024).toFixed(2) : 0;
      const coverSize = t.coverArt ? (t.coverArt.length / 1024 / 1024).toFixed(2) : 0;
      console.log(`Track: ${t.title}`);
      console.log(`- audioUrl size: ${audioSize} MB`);
      console.log(`- coverArt size: ${coverSize} MB`);
      console.log(`- Duration: ${t.duration}`);
    });
  } finally {
    await client.close();
  }
}

checkSizes();
