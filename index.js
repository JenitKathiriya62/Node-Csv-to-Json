const csvtojson = require('csvtojson');
const mongodb = require('mongodb');

const url = "mongodb://localhost:27017/SampleDb";

async function main() {
    try {
        const client = await mongodb.MongoClient.connect(url, {
            useUnifiedTopology: true
        });
        console.log('DB Connected!');
        const dbConn = client.db();

        const fileName = "sample.csv";
        const arrayToInsert = [];

        const source = await csvtojson().fromFile(fileName);
        
        // Fetching all data from each row
        for (let i = 0; i < source.length; i++) {
            const oneRow = {
                firstName: source[i]["Firstname"],
                lastName: source[i]["Lastname"],
                city: source[i]["City"],
                salary: source[i]["Salary"]
            };
            arrayToInsert.push(oneRow);
        }

        // Inserting into the table "employees"
        const collectionName = 'employees';
        const collection = dbConn.collection(collectionName);

        const result = await collection.insertMany(arrayToInsert);
        
        if (result) {
            console.log("Import CSV into database successfully.");
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

main();
