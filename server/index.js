const express = require("express");
const app = express();
const cors = require("cors");
const {
  balances,
  transactions,
  setInitialBalance,
  verifySignature,
  getEthAddress,
} = require("../server/script/functions");

const port = 3042;

app.use(cors());
app.use(express.json());

app.get("/balance/:address", getBalance);
app.get("/transactions/:address", getTransactions);
app.post("/send", sendTransaction);

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function getBalance(req, res) {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
}

function getTransactions(req, res) {
  const { address } = req.params;
  const filteredTransactions = transactions.filter(
    (tx) => tx.sender === address || tx.recipient === address
  );
  res.send({ transactions: filteredTransactions });
}

function sendTransaction(req, res) {
  const { sender, recipient, amount, signature, publicKey, msgHash } = req.body;

  console.log("Received transaction data:", req.body);

  if (!verifySignature(publicKey, signature, msgHash)) {
    return res.status(400).send({ message: "Invalid signature!" });
  }

  const derivedAddress = getEthAddress(publicKey);
  if (derivedAddress.toLowerCase() !== sender.toLowerCase()) {
    return res
      .status(400)
      .send({ message: "Public key does not match sender address!" });
  }

  console.log("Signature and sender address are valid.");

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  balances[sender] -= amount;
  balances[recipient] += amount;

  const transaction = {
    sender,
    recipient,
    amount,
    signature,
    publicKey,
    msgHash,
  };
  transactions.push(transaction); // Add transaction to history

  res.send({ balance: balances[sender], message: "Transaction successful!" });
  console.log("Transaction successful!");
  console.log(`New balance of sender (${sender}): ${balances[sender]}`);
  console.log(
    `New balance of recipient (${recipient}): ${balances[recipient]}`
  );
}
