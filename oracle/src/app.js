const express = require("express");

const app = express();

app.get('/', (req, res) => res.send('HELLO WORLD!'));

const port = 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));