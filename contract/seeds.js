const fs = require("fs");
const eosjs = require("eosjs");

const keypair = {
  public: "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  private: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"
};

const eos = eosjs({
  httpEndpoint: "http://localhost:8888",
  chainId: "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
  keyProvider: keypair.private
});

main().catch(error => {
  console.error(error);
  process.exit(1);
});

async function main() {
  await createAccount("tungsten");
  await setContract("tungsten", process.cwd(), "tungsten");

  await createAccount("bonder");
  await eos.transaction("eosio.token", tr => {
    tr.issue("bonder", "10000.0000 SYS", "Issue tokens", {
      authorization: "eosio.token"
    });
  });
}

function createAccount(name) {
  return eos.transaction(tr => {
    tr.newaccount({
      creator: "eosio",
      name: name,
      owner: keypair.public,
      active: keypair.public
    });
  });
}

async function setContract(account, contractDir, contractName) {
  const wasm = fs.readFileSync(`${contractDir}/${contractName}.wasm`);
  const abi = fs.readFileSync(`${contractDir}/${contractName}.abi`);

  await eos.setcode(account, 0, 0, wasm);
  await eos.setabi(account, JSON.parse(abi));
}
