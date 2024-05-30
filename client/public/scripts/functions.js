import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex, hexToBytes } from "ethereum-cryptography/utils";
import { ec as EC } from "elliptic";

const ec = new EC("secp256k1");

export async function hashMessage(message) {
  return toHex(keccak256(utf8ToBytes(message)));
}

export async function signMessage(privateKey, data) {
  const msgHash = await hashMessage(JSON.stringify(data));
  const key = ec.keyFromPrivate(privateKey, "hex");
  const signature = key.sign(msgHash).toDER("hex");
  return signature;
}

export function getPublicKey(privateKey) {
  const key = ec.keyFromPrivate(privateKey, "hex");
  return key.getPublic().encode("hex");
}

// Function to derive ETH address from public key
export function getEthAddress(publicKey) {
  const pubKeyBytes = hexToBytes(publicKey);
  const hash = keccak256(pubKeyBytes.slice(1)); // Remove the leading byte (0x04) for the uncompressed public key
  return `0x${toHex(hash.slice(-20))}`; // Take the last 20 bytes and convert to hex
}

// Function to verify that the public key matches the given ETH address
export function verifyEthAddress(address, publicKey) {
  const derivedAddress = getEthAddress(publicKey);
  return derivedAddress.toLowerCase() === address.toLowerCase();
}

// Function to validate ETH address
export function isValidEthAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
