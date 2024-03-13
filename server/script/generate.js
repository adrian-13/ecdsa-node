const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

/* === Ethereum Key Generation and Address Derivation === */

// generating a random private key
const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey, false);

// generate public key from private key (no compression)
console.log("Private Key: ", toHex(privateKey));
console.log("Public Key: ", toHex(publicKey));

// convert Uint8Array to hexadecimal string
function uint8ArrayToHex(byteArray) {
  return Array.from(byteArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// generate Ethereum address from public key
function getAddress() {
  const add = keccak256(publicKey.slice(1)).slice(-20);
  return uint8ArrayToHex(add);
}

const address = getAddress(publicKey);
console.log("Address: ", address);

/* === Functions for hash message, sign message, verify message === */

// hash message
function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

// sign message
function signMessage(message) {
  const hashedMessage = hashMessage(message);
  const signature = secp256k1.sign(hashedMessage, privateKey);
  return signature;
}

// verify message
function verifyMessage(message, signature) {
  const hashedMessage = hashMessage(message);
  return secp256k1.verify(signature, hashedMessage, publicKey);
}

// example usage
const message = "This is a message to be signed";
const signature = signMessage(message);
const verificationResult = verifyMessage(message, signature);
console.log("Verification Result:", verificationResult);

// export functions
export default hashMessage;
export default App;
