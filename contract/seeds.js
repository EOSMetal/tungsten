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
  await createAccount("tungstenbond");
  await setContract("tungstenbond", process.cwd(), "tungsten");
  await giveCodeActivePermission("tungstenbond", "tungstenbond");

  await createAccount("bonder");
  await giveCodeActivePermission("bonder", "tungstenbond");

  await eos.transaction("eosio.token", tr => {
    tr.issue("bonder", "100000.0000 EOS", "Issue tokens", {
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

async function giveCodeActivePermission(account, contract) {
  await eos.updateauth(
    account,
    "active",
    "owner",
    {
      threshold: 1,
      keys: [
        {
          key: keypair.public,
          weight: 1
        }
      ],
      accounts: [
        {
          permission: { actor: contract, permission: "eosio.code" },
          weight: 1
        }
      ],
      waits: []
    },
    { authorization: account }
  );
}
