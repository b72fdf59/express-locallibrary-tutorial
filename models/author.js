var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(
  () => `${this.family_name} ${this.first_name}`
);

// Virtual for author's lifespan
AuthorSchema.virtual("lifespan").get(() =>
  (this.date_of_death.getYear() - this.date_of_birthgetYear()).toString()
);

// Virtual for author's URL
AuthorSchema.virtual("url").get(() => "/catalog/author/" + this._id);

module.exports = mongoose.model("Author", AuthorSchema);
