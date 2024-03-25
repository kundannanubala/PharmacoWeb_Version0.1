const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); 
const app = express();

const PORT = process.env.PORT || 5000;

// Replace with your actual MongoDB connection string
const uri = "mongodb://127.0.0.1:27017/";

// Creating a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());
app.use(express.json());

// API endpoint to fetch all drugs
app.get('/api/drugs', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("PharmacoWeb");
        const collection = database.collection("tabletInfo");
        
        // Fetch all documents from the collection
        const drugs = await collection.find({}).toArray();
        res.json(drugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await client.close();
    }
});

// API call to fetch tablets by name
app.get('/api/drugs/search', async (req, res) => {
  const searchString = req.query.names;
  
  try {
      await client.connect();
      const database = client.db("PharmacoWeb");
      const collection = database.collection("tabletInfo");
      
      // Adjusted to search by a partial name using a single query string
      const drugs = await collection.find({ "Medicine_Name": { $regex: searchString, $options: 'i' } }).toArray();
      res.json(drugs);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await client.close();
  }
});

// Add a new POST endpoint in server.js to handle fetching drug details by names
app.post('/api/drugs/details', async (req, res) => {
  try {
      await client.connect();
      const database = client.db("PharmacoWeb");
      const collection = database.collection("tabletInfo");
      
      // Extract names from the request body
      const { names } = req.body;

      // Use $in operator to find documents where the 'Medicine_Name' matches any in the names array
      const drugs = await collection.find({ "Medicine_Name": { $in: names } }).toArray();
      res.json(drugs);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await client.close();
  }
});

app.post('/api/feedback', async (req, res) => {
    try {
      await client.connect();
      const database = client.db("PharmacoWeb");
      const collection = database.collection("feedback");
      
      // Insert the feedback data into the database
      const feedbackData = req.body;
      const result = await collection.insertOne(feedbackData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
