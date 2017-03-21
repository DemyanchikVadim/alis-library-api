import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String },
  createdAt: { type: Date },
});

mongoose.model('Book', BookSchema);
