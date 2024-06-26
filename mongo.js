const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Use command "node mongo.js <yourpassword>" to see database entries or "node mongo.js <yourpassword> <name> <number>" to add a new entry to database')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://salexxandr:${password}@cluster0.8ke9thh.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  number: {
    type: String,
    minLength: 9,
    validate: {
      validator: (v) => {
        return /\d{2,3}-\d+/.test(v) && v.replace('-', '').length > 8
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'Phone number is required']
  },
})


const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}


