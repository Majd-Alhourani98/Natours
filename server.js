const dotenv = require('dotenv');

// Load Environment Variables
dotenv.config();

const app = require('./app');

// Setting the port and starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
