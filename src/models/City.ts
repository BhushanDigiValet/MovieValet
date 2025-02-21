import { Schema, Document, model } from "mongoose";

interface ICity extends Document {
  name: string;
}

const CitySchema = new Schema<ICity>({
  name: { type: String, required: true, unique: true },
});

const City = model<ICity>("City", CitySchema); // Changed "Genre" to "City"

async function seedCity() {
  const existingCount = await City.countDocuments();
  if (existingCount === 0) {
    await City.insertMany([
      { name: "Indore" },
      { name: "Mumbai" },
      { name: "Delhi" },
      { name: "Bengaluru" },
      { name: "Kolkata" },
      { name: "Chennai" },
      { name: "Hyderabad" },
      { name: "Ahmedabad" },
      { name: "Pune" },
      { name: "Jaipur" },
      { name: "Lucknow" },
      { name: "Kochi" },
    ]);
    console.log("Cities seeded successfully!");
  } else {
    console.log("Cities already exist, skipping insertion.");
  }
}

export { City, seedCity };
