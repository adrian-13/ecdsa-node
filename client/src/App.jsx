import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState(""); // New state for public key

  return (
    <div>
      <Wallet
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        publicKey={publicKey}
        setPublicKey={setPublicKey} // Pass setPublicKey to Wallet
      />
      <Transfer
        address={address}
        setBalance={setBalance}
        publicKey={publicKey} // Pass publicKey to Transfer
        privateKey={privateKey} // Pass privateKey to Transfer
      />
    </div>
  );
}

export default App;
