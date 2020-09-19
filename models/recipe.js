const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const databaseURL = 'mongodb+srv://admin:admin@cluster0.aavph.mongodb.net/kitchenette?retryWrites=true&w=majority'

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
};

mongoose.connect(databaseURL, options);

var recipeSchema = new Schema({
    userRef: {type: ObjectId, ref: 'user', required: true},
    recipeName: {type: String, required: true},
    recipeTag: {type: Array},
    recipeIngredients: {type: Array, required: true},
    recipeNotes: {type: String},
    recipePhoto: {type: String}
});

module.exports = mongoose.model('recipe', recipeSchema);