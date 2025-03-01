import { Document, model, Schema } from "mongoose";


interface IGenre extends Document {
  name: string;
}

const GenreSchema = new Schema<IGenre>({
  name: { type: String, required: true, unique: true },
});

const Genre = model<IGenre>('Genre', GenreSchema);

async function seedGenres() {
  const existingCount = await Genre.countDocuments();
  if (existingCount === 0) {
    await Genre.insertMany([
      { name: 'Action' },
      { name: 'Comedy' },
      { name: 'Drama' },
      { name: 'Horror' },
      { name: 'Romance' },
      { name: 'Sci-Fi' },
      { name: 'Thriller' },
      { name: 'Animation' },
      { name: 'Documentary' },
      { name: 'Fantasy' },
      { name: 'Mystery' },
    ]);
    console.log('Genres seeded successfully!');
  } else {
    console.log('Genres already exist, skipping insertion.');
  }
}

export { Genre, seedGenres };
