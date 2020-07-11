const fs = require("fs");
const path = require("path");
const solc = require("solc");

const filePath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(filePath, "utf-8");

const input = {
	language: "Solidity",
	sources: {
		"Lottery.sol": {
			content: source
		}
	},
	settings: {
		outputSelection: {
			"*": {
				"*": ["*"]
			}
		}
	}
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports.abi = output.contracts["Lottery.sol"].Lottery.abi;
module.exports.bytecode = output.contracts["Lottery.sol"].Lottery.evm.bytecode.object;
