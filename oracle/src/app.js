const { response } = require('express')

// set up express app
const express = require('express')
const app = express()

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

const isTrustableSource = () => {
    return true
}

const sendOnChain = () => {
    
}

// Sends updates to blockchain
// Verifies it by checking permitted sources
app.post("/updates", (request,response) => {
    console.log("Received POST /update ");
    data = request.body;
    source_ip = request.ip;

    if (!isTrustableSource(source_ip)){
        return response.send("Untrusable source");
    }

    // The source is trustable
    sendOnChain();

    // The data was sent. Successful

    response.send("Update POST");
});

app.get('/', (req, res) => res.send('HELLO WORLD!'));

const port = 8080;
app.listen(port, '0.0.0.0');