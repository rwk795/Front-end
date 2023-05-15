/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'water_fall';
const collection = 'picture_list';

// Create a new database.
use(database);

// Create a new collection.
db.createCollection(collection);
db.collection.insertMany([
    "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fphoto%2Fm%2Fpublic%2Fp2650049201.jpg&refer=http%3A%2F%2Fimg3.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664935370&t=d4bf3e4d352c277a1bdebfcc8fda959f",
    "https://img1.baidu.com/it/u=2911909188,130959360&fm=253&fmt=auto&app=138&f=JPEG?w=440&h=641",
    "https://t7.baidu.com/it/u=737555197,308540855&fm=193&f=GIF",
    "https://t7.baidu.com/it/u=2582370511,530426427&fm=193&f=GIF",
    "https://t7.baidu.com/it/u=2851687453,2321283050&fm=193&f=GIF",
    "https://t7.baidu.com/it/u=3601447414,1764260638&fm=193&f=GIF",
])
// The prototype form to create a collection:
/* db.createCollection( <name>,
  {
    capped: <boolean>,
    autoIndexId: <boolean>,
    size: <number>,
    max: <number>,
    storageEngine: <document>,
    validator: <document>,
    validationLevel: <string>,
    validationAction: <string>,
    indexOptionDefaults: <document>,
    viewOn: <string>,
    pipeline: <pipeline>,
    collation: <document>,
    writeConcern: <document>,
    timeseries: { // Added in MongoDB 5.0
      timeField: <string>, // required for time series collections
      metaField: <string>,
      granularity: <string>,
      bucketMaxSpanSeconds: <number>, // Added in MongoDB 6.3
      bucketRoundingSeconds: <number>, // Added in MongoDB 6.3
    },
    expireAfterSeconds: <number>,
    clusteredIndex: <document>, // Added in MongoDB 5.3
  }
)*/

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
