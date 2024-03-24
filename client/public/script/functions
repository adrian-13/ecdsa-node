import * as ethUtils from "ethereumjs-util";
import * as crypto from "crypto";

// Define a function to generate a new Ethereum address
function generateNewAddress() {
  // Generate a random 32-byte private key using the crypto library
  const privateKey = crypto.randomBytes(32);

  // Convert the private key to a public key using ethereumjs-util
  const publicKey = ethUtils.privateToPublic(privateKey);

  // Convert the public key to an Ethereum address using ethereumjs-util
  const address = ethUtils.publicToAddress(publicKey);

  // Convert the private key, public key, and address to hexadecimal strings for easy reading
  const privateKeyHex = privateKey.toString("hex");
  const publicKeyHex = publicKey.toString("hex");
  const addressHex = address.toString("hex");

  console.log(`Private Key: 0x${privateKeyHex}`);
  console.log(`Public Key: 0x${publicKeyHex}`);
  console.log(`Ethereum address: 0x${addressHex}`);
}

// Define a function to hash a message
function hashMessage(message) {
  // Use the keccak256 hashing algorithm to hash the input message
  const hashedMessage = ethUtils.keccakFromString(message);
  return hashedMessage;
}

// Define a function to sign a hashed message with a private key
function signMessage(msgHash, privateKeyHex) {
  // Convert the private key from a hex string to a Buffer, removing the '0x' prefix if present
  const privateKey = Buffer.from(privateKeyHex.replace("0x", ""), "hex");
  // Sign the hashed message with the private key using the ECDSA
  const signature = ethUtils.ecsign(msgHash, privateKey);

  return signature;
}
