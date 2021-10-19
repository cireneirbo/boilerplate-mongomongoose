require('dotenv').config();
const mongoose = require('mongoose');
const {Schema} = mongoose;

connectToDB().catch(err => {
  console.log(err)
});

async function connectToDB() {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

const personaSchema = new Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  favoriteFoods: {type: [String], required: false}
});

let Person = mongoose.model("Person", personaSchema);

let person = new Person({
  name: "Eric", 
  age: 32, 
  favoriteFoods: ["cucumbers", "chili", "chips"]
});

let wampire = new Person({
  name: "Mary", 
  age: 320, 
  favoriteFoods: ["blood", "clovers", "pickles"]
});

const createAndSavePerson = (done) => {
  person.save(function(err, data) {
    if(err) {
      return handleError(err);
    }
    done(null, data);
  })
};

let arrayOfPeople = [person, wampire];
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data) {
    if(err) {
      return handleError(err);
    }
    done(null, data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function(err, data) {
    if(err) {
      return handleError(err);
    }
    done(null, data);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function(err, data) {
    if(err) {
      return handleError(err);
    }
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById({_id: personId}, function(err, data) {
    if(err) {
      return handleError(err);
    }
    done(null, data);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, function(err, person) {
    if(err) {
      return handleError(err);
    }
    person.favoriteFoods.push(foodToAdd);
    person.save((err, updatedPerson) => {
      if(err) {
        return handleError(err);
      }
      done(null, updatedPerson);
    })
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOne({name: personName}, (err, person) => {
    if(err) {
      return handleError(err);
    }
    person.age = ageToSet;
    person.save((err, updatedPerson) => {
      if(err) {
        return handleError(err);
      }
      done(null, updatedPerson);
    })
  }, {new: true})
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, person) => {
    if(err) {
      return handleError(err);
    }
    done(null, person);
  })
  
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.deleteMany({name: nameToRemove}, (err, removedMany) => {
    if(err) {
      return console.log(err);
    }
    done(null, removedMany);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch})
    .sort({name: 1})
    .limit(2)
    .select({name: 1, age: 0})
    .exec((err, data) => {
    if(err) {
      return console.log(err);
    }
    done(null, data);
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
