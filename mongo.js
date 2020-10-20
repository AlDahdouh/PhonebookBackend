const mongoose = require("mongoose");

if (process.argv.length > 5 || process.argv.length < 3) {
  console.log(
    "Invalid command!\n1)To add new person: \nnode mongo.js password person_name person_number.\n2)To query all records:\nnode mongo.js password"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.xbn3a.mongodb.net/personsDB?retryWrites=true&w=majority`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Persons = mongoose.model("Persons", personSchema);

const person = new Persons({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3)
  Persons.find({}).then((curser) => {
    console.log("Phonebook:");
    curser.forEach((p) => {
      console.log(p.name, p.number);
    });
    mongoose.connection.close();
  });
else
  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
