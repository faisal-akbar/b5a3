import { model, Schema } from "mongoose";
import { IBooks, IBookStaticMethod } from "../interfaces/books.interface";

const bookSchema = new Schema<IBooks, IBookStaticMethod>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      enum: [
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
      ],
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    copies: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.static("updateAvailableStatus", async function (book) {
  book.available = book.copies > 0;
  await book.save();
});

bookSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Record<string, any>;
    
  if (update && typeof update.copies !== "undefined") {
    if (update.copies === 0) {
      // Update `available` in the update object directly
      if (!update.$set) update.$set = {};
      update.$set.available = false;
    } else if (update.copies > 0) {
      // If copies are greater than 0, set available to true
      if (!update.$set) update.$set = {};
      update.$set.available = true;
    }
  }
  next();
});


export const Book = model<IBooks, IBookStaticMethod>("Book", bookSchema);
