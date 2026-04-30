const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

async function checkTracks() {
  const client = new MongoClient(process.env.DB_URL);
  try {
    await client.connect();
    const db = client.db();
    const tracks = await db.collection('tracks').find({}, { projection: { title: 1, duration: 1, audioUrl: { $slice: 10 }, coverArt: { $slice: 10 } } }).toArray();
    
    console.log(`Total tracks: ${tracks.length}`);
    tracks.forEach(t => {
      console.log(`- ${t.title}: Duration=${t.duration || 'MISSING'}`);
    });
  } finally {
    await client.close();
  }
}

checkTracks();
