var mongoose = require('mongoose')

var Schema = mongoose.Schema

var Genre = new Schema({
    name:{type:String,min:3,max:100}
})

Genre.virtual('url').get(()=>'/catalog/genre' + this._id)

module.exports = mongoose.model('Genre',Genre)