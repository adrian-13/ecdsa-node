import { useState } from "react";
import server from "./server";
import {
  signMessage,
  verifyEthAddress,
  isValidEthAddress,
  hashMessage,
} from "../public/script/functions"; // Import hashMessage

function Transfer({ address, setBalance, publicKey, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!sendAmount || !recipient || !publicKey || !address || !privateKey) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidEthAddress(address)) {
      alert("Invalid ETH address!");
      return;
    }

    if (!isValidEthAddress(recipient)) {
      alert("Invalid recipient ETH address!");
      return;
    }

    if (recipient.toLowerCase() === address.toLowerCase()) {
      alert("Recipient address cannot be the same as sender address!");
      return;
    }

    if (publicKey.length !== 130) {
      alert("Invalid public key length!");
      return;
    }

    if (privateKey.length !== 64) {
      alert("Invalid private key length!");
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid send amount!");
      return;
    }

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

      const msgHash = await hashMessage(JSON.stringify(data));
      const signature = await signMessage(privateKey, data);

      const transaction = {
        ...data,
        signature: signature,
        publicKey: publicKey,
        msgHash: msgHash, // Include msgHash in the transaction object
      };

      console.log("Transaction object:", transaction);

      const response = await server.post(`send`, transaction);

      console.log("Server response:", response);

      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
        alert("Transaction successful!"); // Display alert for success message
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
