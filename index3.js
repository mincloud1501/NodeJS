var express = require("express");
var graphqlHTTP = require("express-graphql");
var Graphql = require("graphql");
var sampleDatabase = require("./data/sampleData");

var app = express();

app.listen(4000);
console.log("Running a GraphQL server");

// sampledata schema
const productType = new Graphql.GraphQLObjectType({
    name: "Product",
    fields: {
      id: { type: Graphql.GraphQLInt },
      name: { type: Graphql.GraphQLString },
      price: { type: Graphql.GraphQLInt },
      manufacturer: { type: Graphql.GraphQLString },
    }
  });

  var queryType = new Graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      //요청 타입 1 : id를 argument로 받아 조건 매칭
      product : {
        type: productType,
        args: {
          id: { type: Graphql.GraphQLInt }
        },
        resolve: function(obj, args, context, info) {
          const data = Object.keys(sampleDatabase).filter(element => {
            if (sampleDatabase[element].id == args.id) {
              return element;
            }
          });
          return sampleDatabase[data];
        }
      },
      //요청 타입 2 : 모든 제품의 정보
      products : {
        type: new Graphql.GraphQLList(productType),
        resolve: function(obj, args, context, info) {
          return sampleDatabase;
        }
      }
    }
  });

var schema = new Graphql.GraphQLSchema({ query: queryType });

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true // 라우트 경로(/graphql)에 접속했을 때 검색 도구를 노출할지 여부를 결정
  })
);