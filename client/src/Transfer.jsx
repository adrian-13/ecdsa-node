import { useState } from "react";
import server from "./server";
import {
  signMessage,
  verifyEthAddress,
  isValidEthAddress,
} from "../public/script/functions"; // Import signMessage, verifyEthAddress and isValidEthAddress

function Transfer({ address, setBalance, publicKey, privateKey }) {
  // Receive privateKey as a prop
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!sendAmount || !recipient || !publicKey || !address || !privateKey) {
      alert("Please fill in all fields.");
      return;
    }

    // Validate ETH address
    if (!isValidEthAddress(address)) {
      alert("Invalid ETH address!");
      return;
    }

    // Validate recipient address
    if (!isValidEthAddress(recipient)) {
      alert("Invalid recipient ETH address!");
      return;
    }

    // Validate that the recipient address is not the same as the sender's address
    if (recipient.toLowerCase() === address.toLowerCase()) {
      alert("Recipient address cannot be the same as sender address!");
      return;
    }

    // Validate public key length
    if (publicKey.length !== 130) {
      alert("Invalid public key length!");
      return;
    }

    // Validate private key length
    if (privateKey.length !== 64) {
      alert("Invalid private key length!");
      return;
    }

    // Validate send amount
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid send amount!");
      return;
    }

    // Verify the ETH address and public key match only if public key is provided
    if (!verifyEthAddress(address, publicKey)) {
      alert("Public key does not match the ETH address!");
      return;
    }

    try {
      const data = {
        sender: address,
        recipient: recipient,
        amount: amount,
      };

      const signature = await signMessage(privateKey, data);

      const transaction = {
        ...data,
        signature: signature,
        publicKey: publicKey, // Include the public key in the transaction object
      };

      // Kontrolný kód na vypísanie transakčného objektu do konzoly
      console.log("Transaction object:", transaction);

      const response = await server.post(`send`, transaction);

      // Skontrolujte, čo server skutočne vrátil
      console.log("Server response:", response);

      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
      } else {
        alert("Unexpected response from server");
      }
    } catch (ex) {
      alert(ex.response?.data?.message || ex.message);
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
