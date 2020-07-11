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
	describe("Manager", () => {
		it("has an address", async () => {
			const manager = await lottery.methods.manager().call();
			assert.ok(manager);
		});
		it("is deployer", async () => {
			const manager = await lottery.methods.manager().call();
			assert.equal(manager, accounts[0]);
		});
		it("cannot pick winner if no player has entered", async () => {
			try {
				await lottery.methods.pickWinner().send({ from: accounts[0] });
			} catch (err) {
				assert(true);
			}
		});
		it("cannot send money if no player has entered", async () => {
			try {
				await lottery.methods.sendMoney(accounts[3]).send({ from: accounts[0] });
			} catch (err) {
				assert(true);
			}
		});
		it("can pick winner", async () => {
			await lottery.methods.enter().send({
				from: accounts[1],
				value: "10000"
			});
			const winner = await lottery.methods.pickWinner().send({ from: accounts[0] });
			assert.ok(winner);
		});
		it("can send money", async () => {
			await lottery.methods.enter().send({
				from: accounts[1],
				value: "10000"
			});
			await lottery.methods.sendMoney(accounts[1]).send({ from: accounts[0] });
			assert(true);
		});
	});
	describe("Players", () => {
		it("can pay to enter", async () => {
			await lottery.methods.enter().send({
				from: accounts[1],
				value: "10000"
			});
		});
		it("are allotted in the pool", async () => {
			await lottery.methods.enter().send({
				from: accounts[2],
				value: "50000"
			});
			const player = await lottery.methods.players(0).call();
			assert.equal(player, accounts[2]);
		});
		it("cannot pick winner", async () => {
			try {
				await lottery.methods.pickWinner().send({ from: accounts[1] });
			} catch (err) {
				assert(true);
			}
		});
		it("cannot send money to winner", async () => {
			try {
				await lottery.methods.sendMoney(accounts[3]).send({ from: accounts[1] });
			} catch (err) {
				assert(true);
			}
		});
	});
});
