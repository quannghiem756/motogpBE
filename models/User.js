const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
      validator: mongoose.validator.isEmail,
      message: 'Please fill a valid email address'
    }
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  }
});

UserSchema.pre('save', async function(next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  }

  next();
});
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await this.findOne({ email });

  if (!user) {
      throw new Error('Unable to login!');
  }

  const isCorrect = await bcrypt.compare(password, user.password);

  if (!isCorrect) {
      throw new Error('Unable to login!');
  }

  return user;
}
module.exports = mongoose.model('User', UserSchema);

