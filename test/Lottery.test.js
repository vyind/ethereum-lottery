const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require("../compile");

let accounts;
let lottery;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	lottery = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi)))
		.deploy({
			data: bytecode,
			arguments: []
		})
		.send({
			from: accounts[0],
			gasLimit: "1000000"
		});
});

describe("Lottery", () => {
	it("can fetch accounts", () => {
		assert.ok(accounts);
	});
	it("can deploy a contract", () => {
		assert.ok(lottery.options.address);
	});
	it("has a manager address", async () => {
		const manager = await lottery.methods.manager().call();
		assert.ok(manager);
	});
	it("has deployer as manager", async () => {
		const manager = await lottery.methods.manager().call();
		assert.equal(manager, accounts[0]);
	});
});
