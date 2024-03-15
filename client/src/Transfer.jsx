import { useState } from "react";
import server from "./server";
import {
  hashMessage,
  signMessage,
  verifyMessage,
  uint8ArrayToHex,
  recoveryPublicKey,
} from "../../server/script/generate";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // A hard-coded example of a private key. In production, never expose private keys in your source code.
  const privateKey =
    "c46726e39b7108efa8b39beea426abf6f3928abaaafd30f63efdd9c224bab8e9";

  // A generic setter function to update state based on event input.
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      // Generates a hash of the transaction details.
      const messageHash = hashMessage(recipient + sendAmount);
      console.log("Message hash in hex: ", uint8ArrayToHex(messageHash));

      // Signs the message hash using the private key.
      const signature = signMessage(messageHash, privateKey);
      console.log(signature);

      /* === // The following is an example of how to recover the public key from a signature
      and verify that signature against a message hash, typically performed on the server side.
      === */

      // Attempts to recover the public key from the signature. This is usually necessary for verification purposes.
      const recoveredPublicKey = signature.recoverPublicKey(messageHash);
      // Prepending '04' is a common practice for indicating an uncompressed public key.
      const publicKey = "04" + recoveryPublicKey(recoveredPublicKey);
      console.log(`Public Key (hex): ${publicKey}`);
      // Verifies the signature against the message hash and public key.
      const messageVerify = verifyMessage(signature, messageHash, publicKey);
      console.log(messageVerify);

      // Sends transaction details to the server and updates the balance upon success.
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        messageHash,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
