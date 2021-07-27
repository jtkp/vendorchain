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
    const vendorFile = fs.readFileSync("contracts/Vendor.sol","utf8");
    sources["Vendor.sol"] = { content: vendorFile };
    const vendorFactoryFile = fs.readFileSync("contracts/VendorFactory.sol","utf8");
    sources["VendorFactory.sol"] = { content: vendorFactoryFile};
    
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

const compiled = compileSols(["Vendor"]);
if ("errors" in compiled){
    console.log("Compilation failed");
    console.log(compiled.errors);
    process.exit(1);
} 

const contracts = compiled.contracts;
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

const vendorContract = contracts["Vendor.sol"]
fs.outputJsonSync(path.resolve(buildPath,'Vendor.json'), vendorContract["Vendor"]); 
const vendorFactoryContract = contracts["VendorFactory.sol"]
fs.outputJsonSync(path.resolve(buildPath,'VendorFactory.json'), vendorFactoryContract["VendorFactory"]); 

process.exit();