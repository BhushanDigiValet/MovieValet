const movieTypeDefs = `#graphql

    type Genre {
    id: ID!
    name: String!
  }

  type StarCast {
  name: String!
  image: String!
}

type Movie {
  id: ID!
  title: String!
  description: String
  genre:  ID!
  imdbRating: Float
  language: [String!]!
  posterUrl: String!
  starCast: [StarCast!]!
  durationMinutes: Int
  releaseDate: String
  isDeleted: Boolean!
  createdBy: User
  updatedBy: User
  createdAt: String!
  updatedAt: String!
}

input StarCastInput {
  name: String!
  image: String!
}

input CreateMovieInput {
  title: String!
  description: String
  genre:  ID!
  imdbRating: Float
  language: [String!]!
  posterUrl: String!
  starCast: [StarCastInput!]!
  durationMinutes: Int
  releaseDate: String
}

input UpdateMovieInput {
  title: String
  description: String
  genre:  ID!
  imdbRating: Float
  language: [String!]
  posterUrl: String
  starCast: [StarCastInput!]
  durationMinutes: Int
  releaseDate: String
}
input MovieFilterInput {
  title: String
  genre: ID
  imdbRating: Float
}

type Query {
  movies(input: MovieFilterInput): [Movie!]!
  movie(id: ID!): Movie
}

type Mutation {
  createMovie(input: CreateMovieInput!): Movie!
  updateMovie(id: ID!, input: UpdateMovieInput!): Movie!
  deleteMovie(id: ID!): Boolean!
}

`;
export default movieTypeDefs;
