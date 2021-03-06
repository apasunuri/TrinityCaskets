// Router for user

// Middleware
const express = require('express');
// Function from express
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// To get our secret key


// User Model
const UserSchema = require('../models/UserSchema');

// Route the post request
router.post('/', (req, res) =>{

    // Grab the inputted info
    const { name, email, password, admin, items } = req.body;

    // Make sure all fields are filled out
    if(!name || !email || !password) {
        return res.status(400).json({ msg: 'Please fill out all fields' });
    }

    UserSchema.findOne({ email }).then(user => {
        // Check if user's email already exists
        if (user)
            return res.status(400).json({msg: 'Email already exists'});

        // If not, add new user
        const newUser = new UserSchema({
            name,
            email,
            password,
            admin,
            items
        });

        // Create salt (random string of bits to encrypt)
        bcrypt.genSalt(10, (err, salt) => {
            // Hash (more encryption). Takes in password + the generated salt
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                // Update the password to be encrypted
                newUser.password = hash;
                // Save the user
                newUser.save().then(user => {

                    // Create token for authentication
                    jwt.sign(
                        // User id is token identifier
                        { id: user.id },
                        // Secret key
                        process.env.JWT_SECRET || require('../config/config').jwt.jwtSecret,
                        (err, token) => {
                            if(err) throw err;

                            // Send the response
                            res.json({
                                // Token becomes part of the response
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    admin: false,
                                    items: []
                                }
                            });
                        }
                    )
                });
            })
        });
    });


});


module.exports = router;