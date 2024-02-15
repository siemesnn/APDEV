const User = require('../model/user');
const userjson = require('../test/users.json');

exports.loginUser = (req, res) => {
    // Check if the user exists
    const { username, password } = req.body;

    const users = Object.values(userjson.users); // Convert users object to an array

    const user = users.find(user => user.username === username && user.password === password);

    // Debugging information
    console.log('User:', user);

    // Send appropriate status
    if (user) {
        res.status(200).send({ username: username });
    } else {
        res.status(401).send('Invalid username or password');
    }
};

    exports.returnUser = (req, res) => {
        // Check if the user exists
        const { username, password } = req.body;
    
        const users = Object.values(userjson.users); // Convert users object to an array
    
        const user = users.find(user => user.username === username && user.password === password);
    
        // Debugging information
        console.log('User:', user);
    
        // Send appropriate status and user data
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(401).send('Invalid username or password');
        }
    };
    
