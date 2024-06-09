const { keccak256 } = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils");
const { ec: EC } = require("elliptic");

const ec = new EC("secp256k1");

const balances = {
  "0x9d752bdb42acf017fc4bafc61f31b0b55976a762": 100,
  "0xe23604a7e6cf0f74f968080d97cb47d89d91076e": 50,
  "0xd04297d44301c7e44ceffd4479030e58dde00ca5": 75,
};

const transactions = []; // Store transaction history

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function verifySignature(publicKey, signature, msgHash) {
  const key = ec.keyFromPublic(publicKey, "hex");
  const msgHashBytes = hexToBytes(msgHash);
  return key.verify(msgHashBytes, signature);
}

function getEthAddress(publicKey) {
  const pubKeyBytes = hexToBytes(publicKey);
  const hash = keccak256(pubKeyBytes.slice(1)); // Remove the leading byte (0x04) for the uncompressed public key
  return `0x${toHex(hash.slice(-20))}`; // Take the last 20 bytes and convert to hex
}

module.exports = {
  balances,
  transactions,
  setInitialBalance,
  verifySignature,
  getEthAddress,
};
