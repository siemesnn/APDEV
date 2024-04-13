const User = require('../model/user');
const {client, DB_NAME } = require('../model/database');
const bcrypt = require("bcrypt");


exports.registerUser = async (req, res) => {

    const db = client.db(DB_NAME);
    const users = db.collection('users');
    try {
        const { name, email, username, password, confirmPassword, role } = req.body;

        console.log("password ", password);
        console.log("confirmPassword", confirmPassword);

        // Check if the username already exists using Mongoose
        const existingUser = await users.findOne({ username });

        if (existingUser) {
            res.status(400).json({ message: "Username is already taken!" });
            return;
        }

        // Hash the password before storing it in the database
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds); //hashs user pw with 10rounds

        // Create a new user document using the Mongoose model
        const newUser = new User({
            name,
            email,
            username,
            password: hash,
            role,
            description : '',
            profilePicture: 'https://www.redditstatic.com/avatars/avatar_default_02_4856A3.png',
            reservations : [],
        });

        // Save the new user to the database
        await users.insertOne(newUser);
        res.status(201).json({ message: "User created" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Reuse the MongoDB client and database connection
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "User not found!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Create or update the session
            req.session = req.session || {};
            req.session.authenticated = true;
            req.session.username = username;
            return res.status(200).json(req.session);
        } else {
            return res.status(401).json({ message: "Invalid credentials!" });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.getUser = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username: req.session.username });
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};




exports.editDescription = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username: req.session.username });

        await users.updateOne({ username: req.session.username }, { $set: { description: req.body.description } });

        res.status(200).json({ message: "Description updated" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

exports.editPFP = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        const user = await users.findOne({ username: req.session.username });

        await users.updateOne({ username: req.session.username }, { $set: { pictureURL: req.body.pictureURL } });

        res.status(200).json({ message: "Profile Picture updated" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}     

exports.deleteUser = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const users = db.collection('users');
        
        // Delete the user from the database
        await users.deleteOne({ username: req.session.username });
        
        // End the session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).json({ message: "Internal server error" });
            } else {
                res.status(200).json({ message: "User deleted" });
            }
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        // End the session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).json({ message: "Internal server error" });
            } else {
                res.status(200).json({ message: "Logged out" });
            }
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

