const { abi, bytecode } = require("./compile");
const { account, networkUrl, passPhrase } = require("./settings");
const WalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const provider = new WalletProvider(passPhrase, networkUrl);
const web3 = new Web3(provider);

let lottery;

const deploy = async () => {
	console.log("Deploying contract from " + account);
	lottery = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi)))
		.deploy({ data: "0x" + bytecode })
		.send({ from: account });
	console.log(JSON.stringify(abi));
	console.log("Contract deployed to " + lottery.options.address);
};

deploy();
