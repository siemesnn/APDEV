const mongoose = require('mongoose'); // Assuming you're using Mongoose
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true }, // Ensure unique email for user identification
    password: String, // Store securely hashed passwords (use a strong hashing algorithm like bcrypt)
    username: String, // Ensure unique username for login
    pictureURL: String, // Optional URL for user's profile picture
    role: { type: String, enum: ['student', 'admin'] }, // Limit role options to prevent invalid data
    description: { type: String },
  
    reservations: [ // Corrected: Add comma after closing curly brace
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation' // Capitalize 'Reservation' for consistency (assuming a separate schema)
      }
    ]
  });
  
const User = mongoose.model('User', userSchema);

module.exports = User;
