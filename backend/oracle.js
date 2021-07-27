const verify = (request, response) => {
    console.log("Received log ");  
    if (!trustable(request)){
        res = {"error": "Sender is not trusted"}
        return response.send(res);
    }
    data = request.body;

    // The source is trustable
    err = correctFormat(data)
    if (err !== null){
        res = {"error": err}
        return response.send(res);
    }

    // Payload is well formatted

    err = sendOnChain();
    if (err !== null){
        res = {"error": err}
        return response.send(res);
    }

    // The data is on chain
    response.send({
        "data": data
    });
};

const trustable = (request) => {
    sourceIp = request.ip;
    // Check trustable source_ips
    trustableSources = ['127.0.0.1'];
    console.log(sourceIp);
    return trustableSources.includes(sourceIp);
}

/* 
data must be of the form
{
    "port": int (id of the port)
    "bandwidth": int (bandwidth in mb)
    "timestamp": YYYY-MM-DD
}
*/
const correctFormat = (data) => {
    if (typeof(data) !== 'object'){
        return false;
    }
    fields = ['port', 'bandwidth','timestamp'];
    for (const key in data) {
        if (!fields.includes(key)){
            return false;
        }
    }
    // keys(data) ⊂ "fields" 
    for (let field in fields){
        if(!field in data){
            return false;
        } 
    }
    // fields ⊂ keys(data) 
    // fields = keys(data)
    bandwidth = data["bandwidth"]
    if(typeof(bandwidth) !== 'number' || bandwidth < 0){
        return "bandwidth must be a non-negative integer";
    }
    // Bandwidth is well formatted
    port = data["port"]
    if(typeof(port) !== 'number' || port < 0){
        return "port must be a non-negative integer";
    }
    // Port is well formatted

    // TODO: Check if timestamp is well formatted
    
    return null
}

const sendOnChain = (data) => {
    return null;
};

 
module.exports = {
    verify
}