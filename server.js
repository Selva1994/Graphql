const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const axios = require('axios');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const app = express();

const books = [
    { id:1, name: "book1",authorId: 1 },
    { id:2, name: "book1",authorId: 2 },
    { id:3, name: "book1",authorId: 3 },
    { id:4, name: "book1",authorId: 4 },
    { id:5, name: "book1",authorId: 5 },
    { id:6, name: "book1",authorId: 6 },
    { id:7, name: "book1",authorId: 7 }
];

const authors = [
    { id:1, name: "name1"},
    { id:2, name: "name2"},
    { id:3, name: "name3"},
    { id:4, name: "name4"},
    { id:5, name: "name5"},
    { id:6, name: "name6"},
    { id:7, name: "name7"},

];

let comments = [];
// [
//         {
//           "postId": 1,
//           "id": 1,
//           "name": "id labore ex et quam laborum",
//           "email": "Eliseo@gardner.biz",
//           "body": "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium"
//         },
//         {
//           "postId": 1,
//           "id": 2,
//           "name": "quo vero reiciendis velit similique earum",
//           "email": "Jayne_Kuhic@sydney.com",
//           "body": "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et"
//         }
// ];


async function getComments() {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/comments')
    //   console.log(response);

        // console.log(response.data)
        comments = response.data;
        

    } catch (error) {
      console.error(error);
    }
  }

  getComments();

const BookType= new GraphQLObjectType({
    name: "Book",
    description : "Book Description",
    fields: () =>({
        id: { type: new GraphQLNonNull(GraphQLInt)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        authorId: { type: new GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book)=>{
                return authors.find(author=> author.id === book.authorId);
            }
        }
    })
})

const AuthorType= new GraphQLObjectType({
    name: "Author",
    description : "Author Description",
    fields: () =>({
        id: { type: new GraphQLNonNull(GraphQLInt)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        books: {
            type: BookType,
            resolve: (author)=>{
                return books.find(book=> book.authorId === author.id);
            }
        }
    })
})

const CommentType= new GraphQLObjectType({
    name: "Comment",
    description : "Comment Description",
    fields: () =>({
        postId: { type: new GraphQLNonNull(GraphQLInt)},
        id: { type: new GraphQLNonNull(GraphQLInt)},
        name: { type: new GraphQLNonNull(GraphQLString)},
        email: { type: new GraphQLNonNull(GraphQLString)},
        body: { type: new GraphQLNonNull(GraphQLString)},
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: 'root query',
    fields:() => ({
        book: {
            type: BookType,
            description: 'single book',
            args: {
                id: { type: GraphQLInt}
            },
            resolve : (parent,args)=> books.find(book=> book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'list of books',
            resolve : ()=> books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'list of authors',
            resolve : ()=> authors
        },
        comments: {
            type: new GraphQLList(CommentType),
            description: 'list of comments',
            args: {
                name: { type: GraphQLString},
                body: { type: GraphQLString}
            },
            resolve : (parent,args)=> {
                
                // let arr = [...comments]
                // console.log(arr)

                // comments = Array.from(comments,t=> t);
                // console.log(comments)
                // return comments;
                return comments.filter(comment=> comment.name.includes(args.name) || comment.body.includes(args.body))
            } 
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

// new GraphQLObjectType({
//     name: "books",
//     fields : {
//         bookName:{
//             type : GraphQLString,
//             resolve: () => 'BookName'
//         },
//         date: {
//             type: GraphQLString,
//             resolve: ()=> new Date().toString()
//         }
//     }
    
// })

app.use('/graphql', graphqlHTTP({
    schema:schema,
    graphiql: true
}));
app.listen(5000);




//query

// {
//     comments(name: "labore ex et quam laborum",body:"pariatur\nnihil") {
//       id
//       name
//       body
//     }
//   }