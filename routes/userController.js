const express = require('express');
const router = express.Router();
const User = require('../models/User'); // assuming the User model is in models/User.js
const jwt = require('jsonwebtoken');

//Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = jwt.sign({ user }, 'secretKey', { expiresIn: '1h' });
    res.status(302).send({ token });
  }
  catch (error) {
    res.status(400).json(error);
  }
})

// CREATE
router.post('/users/registration', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// READ ALL
router.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().then((users) => {
      return users;
    }).catch((err) => {
      console.error(err);
      throw err;
    });
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching users' });
  }
});

// READ ONE
router.get('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).then((user) => {
      return user;
    }).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching user' });
  }
});

// UPDATE
router.put('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).then((user) => {
      return user;
    }).catch((err) => {
      console.error(err);
      throw err;
    });
    if (!updatedUser) return res.status(404).send({ message: 'User not found' });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send({ message: 'Error updating user' });
  }
});

// DELETE
router.delete('/api/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndRemove(id).then(() => {
      return true;
    }).catch((err) => {
      console.error(err);
      throw err;
    });
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user' });
  }
});



module.exports = router;
