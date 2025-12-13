// models/Category.js
import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  subcategories: { type: [String], default: [] },
}, { timestamps: true });

CategorySchema.pre('save', function (next) {
  if (this.name) {
    const t = String(this.name).trim().toLowerCase().split(' ').filter(Boolean);
    this.name = t.map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
  }
  this.subcategories = this.subcategories.map(s => {
    const tt = String(s).trim().toLowerCase().split(' ').filter(Boolean);
    return tt.map(x => x[0].toUpperCase() + x.slice(1)).join(' ');
  });
  next();
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
