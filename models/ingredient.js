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

var ingredientSchema = new Schema({
    userRef: {type: ObjectId, ref: 'user' ,required: true},
    ingredientName: {type: String, required: true},
    isAvailable: {type: Boolean, required: true}
});

module.exports = mongoose.model('ingredient', ingredientSchema);