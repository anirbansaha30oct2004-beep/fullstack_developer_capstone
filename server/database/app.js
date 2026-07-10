const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

// Read local JSON files
const reviews_data = JSON.parse(fs.readFileSync("./data/reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("./data/dealerships.json", 'utf8'));

// 🔌 Local Safe Database Connection (Catches errors silently if MongoDB isn't running locally)
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' })
  .then(() => {
    console.log("Connected to MongoDB Container successfully.");
    // Seed the database only if connection succeeds
    const Reviews = require('./review');
    const Dealerships = require('./dealership');
    Reviews.deleteMany({}).then(() => Reviews.insertMany(reviews_data['reviews']));
    Dealerships.deleteMany({}).then(() => Dealerships.insertMany(dealerships_data['dealerships']));
  })
  .catch(err => {
    console.log("MongoDB container not detected locally. Using safe JSON data array fallback mode instead.");
  });

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Helper checking function to see if live database connection is operational
const isDbConnected = () => mongoose.connection.readyState === 1;

// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API")
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    if (isDbConnected()) {
      const documents = await Reviews.find();
      return res.json(documents);
    }
    res.json(reviews_data['reviews'] || reviews_data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const documents = await Reviews.find({ dealership: req.params.id });
      return res.json(documents);
    }
    const filtered = (reviews_data['reviews'] || reviews_data).filter(r => String(r.dealership) === String(req.params.id));
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// ✅ Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    if (isDbConnected()) {
      const documents = await Dealerships.find();
      return res.json(documents);
    }
    res.json(dealerships_data['dealerships'] || dealerships_data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// ✅ Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
  try {
    if (isDbConnected()) {
      const documents = await Dealerships.find({ state: req.params.state });
      return res.json(documents);
    }
    const filtered = (dealerships_data['dealerships'] || dealerships_data).filter(d => String(d.state).toLowerCase() === String(req.params.state).toLowerCase());
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships by state' });
  }
});

// ✅ Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const document = await Dealerships.findOne({ id: req.params.id });
      if (!document) return res.status(404).json({ error: 'Dealer not found' });
      return res.json(document);
    }
    const dealer = (dealerships_data['dealerships'] || dealerships_data).find(d => String(d.id) === String(req.params.id));
    if (!dealer) return res.status(404).json({ error: 'Dealer not found' });
    res.json(dealer);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer details' });
  }
});

//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    let data = JSON.parse(req.body);
    let new_id = Date.now(); // Stable unique fallback ID calculation

    if (isDbConnected()) {
      const documents = await Reviews.find().sort({ id: -1 });
      if (documents.length > 0) {
        new_id = documents[0]['id'] + 1;
      }
    }

    const review = new Reviews({
      "id": new_id,
      "name": data['name'],
      "dealership": data['dealership'],
      "review": data['review'],
      "purchase": data['purchase'],
      "purchase_date": data['purchase_date'],
      "car_make": data['car_make'],
      "car_model": data['car_model'],
      "car_year": data['car_year'],
    });

    if (isDbConnected()) {
      const savedReview = await review.save();
      return res.json(savedReview);
    }

    // Local array pushing modification simulation
    if (!reviews_data['reviews']) reviews_data['reviews'] = [];
    reviews_data['reviews'].push(review);
    res.json(review);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});