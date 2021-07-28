const process = require('process');
const solc    = require('solc');
const path    = require('path');
const fs      = require('fs-extra');

// INPUT: .sol file in "smart_contract"
// OUTPUT: The contents of "smart_contracts/importPath" 
function findImports(importPath){
    try {
        return {
            contents: fs.readFileSync(`smart_contracts/${importPath}`, "utf8"),
        }
    } catch (e) {
        return {
            error: e.message
        };
    }
}

// Compiles .sol files in "solNames"
const compileSols = (solNames) => {
    let sources = {}
    solNames.forEach((value, index, array) => {
        let sol_file = fs.readFileSync(`contracts/${value}.sol`, 'utf8');
        sources[value] = {
            content: sol_file
        };
    });
    let input = {
        language: 'Solidity',
        sources: sources,
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };
    let compiler_output = solc.compile(JSON.stringify(input), {
        import: findImports
    });
    let output = JSON.parse(compiler_output);
    return output;
}

const compiled = compileSols(["temp","temp2"]);
if ("errors" in compiled){
    console.log("Compilation failed");
    console.log(compiled.errors);
    process.exit(1);
} 

const contracts = compiled.contracts;
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

// Store contracts?
for (let contract in contracts) {
    fs.outputJsonSync(
      path.resolve(buildPath, contract.replace(':', '') + '.json'),
      contracts[contract]
    );
  }
process.exit();