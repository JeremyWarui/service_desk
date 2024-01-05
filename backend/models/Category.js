import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
  });
  
  const Category = mongoose.model('Category', CategorySchema);

  export default Category;
  