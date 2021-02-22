import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
    console.log("environment variables taken from system");
}

import {ApolloServer, gql, makeExecutableSchema} from "apollo-server";
import {default as mongodb} from 'mongodb';

const {MongoClient} = mongodb; // ist das Gleiche wie: const MongoClient = mongodb.MongoClient;

import Books from "./data-sources/Books.js";

/*const client = new MongoClient(process.env["MONGODB_URI"], { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect();*/

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    type Book {
        bookId: ID!
        title: String
        author: String
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        books: [Book]
    }

    type Mutation {
        addBook(id: String!, title: String!, author: String!): Book!
    }
`;

const books = [
    {
        bookId: "0001",
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        bookId: "0002",
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
//books: () => books,
const resolvers = {
    Query: {
        books(_parent, _args, _context, _info) {
            return _context.db
                .collection('books')
                .findOne()
                .then((data) => {
                    return data.books
                });
        }
    },
    Mutation: {
        addBook: async (_, {id, title, author}, {dataSources}) => {
            const results = await dataSources.db.addBook(id, title, author);
            
            const book = {
                bookId: id,
                title,
                author
            };
            
            return book;
        }
    }
};

/* The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        books: new Books(client.db("ch_db").collection("books"))
    })
});*/

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

let db
const server = new ApolloServer({
    schema,
    context: async () => {
        if (!db) {
            try {
                const dbClient = new MongoClient(
                    process.env["MONGODB_URI"],
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    }
                )

                if (!dbClient.isConnected()) await dbClient.connect()
                db = dbClient.db('ch_db') // database name

                console.log('CONNECTED TO MONGODB');
            } catch (e) {
                console.log('--->error while connecting with graphql context (db)', e)
            }
        }

        return {db}
    },
})

// The `listen` method launches a web server.
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});