const fs = require('fs');

const sleep = async (milliseconds) =>{
    await new Promise(resolve => setTimeout(resolve, milliseconds));
} 

const isEmpty= (fields) =>{
    Object.entries(fields).length === 0;
}

// Returns the contents of fields.json
const readFields = () => {
    data = fs.readFileSync('./fields.json', 'utf8');
    fields = JSON.parse(data); 
    return fields;
}

// Given the previous and current set of fields
// find the difference.
const findUpdates = (prevFields, currFields) => {
    updates = {}
    for (const key in currFields){
        if (prevFields[key] != currFields[key]){
            updates[key] = currFields[key];
        }
    }
    return updates;
}

// updates = {bandWidth, }
const sendUpdates = async (updates) => {
    const payload = updates;
    const res = await("http://localhost:8080/updates", payload);
    console.log(res.data);
}

const main = async () => {
    let currFields = readFields();
    let prevFields = currFields;
    while (true){
        await sleep(500);
        prevFields = currFields;
        currFields = readFields();
        updates = findUpdates(prevFields, currFields); 
        if (!isEmpty(updates)){
            console.log("Not eq");
            console.log(prevFields);
            console.log(currFields);
            await sendUpdates(updates) // Replace with send updates to oracle
            console.log(updates);
        }
    }
}

main();