const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { PassThrough } = require('supertest/lib/test');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 128,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
      },
      message: 'Please fill a valid email address'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

//Hashing the user's password
UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  }

  next();
});
// Find user by email and password
UserSchema.statics.findByCredentials = async (email, password) => {
  try {
    const userPassword = await User.findOne({ email }).select('password');
    const user = await User.findOne({ email});
    console.log(user)
    if (!user) {
      throw new Error('Unable to login!');
    }

    const isCorrect = await bcrypt.compare(password, userPassword.password);

    if (!isCorrect) {
      throw new Error('Unable to login!');
    }

    return user;
  }
  catch (error) {
    console.log(error);
    throw error;
  }


}
const User = mongoose.model('User', UserSchema);
module.exports = User;

