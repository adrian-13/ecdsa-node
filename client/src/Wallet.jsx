import server from "./server";
import { isValidEthAddress } from "../public/script/functions"; // Import isValidEthAddress

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  publicKey,
  setPublicKey, // New prop for setPublicKey
}) {
  // Separate onChange handlers for address, private key, and public key to ensure they're set independently.
  const onChangeAddress = async (evt) => {
    const newAddress = evt.target.value;
    setAddress(newAddress);

    // Validate ETH address
    if (newAddress && !isValidEthAddress(newAddress)) {
      alert("Invalid ETH address!");
      return;
    }

    // Fetch and set the balance only if the address is provided.
    if (newAddress) {
      try {
        const {
          data: { balance },
        } = await server.get(`balance/${newAddress}`);
        setBalance(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(0);
      }
    } else {
      setBalance(0);
    }
  };

  const onChangePrivateKey = (evt) => {
    // Set private key from input without trying to fetch balance.
    const newPrivateKey = evt.target.value;
    setPrivateKey(newPrivateKey);
  };

  const onChangePublicKey = (evt) => {
    // Set public key from input without trying to fetch balance.
    const newPublicKey = evt.target.value;
    setPublicKey(newPublicKey);

    // Validate public key length
    if (newPublicKey && newPublicKey.length !== 130) {
      alert("Invalid public key length!");
    }
  };

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChangeAddress}
        ></input>
      </label>
      <label>
        Private Key
        <input
          type="password"
          placeholder="Type a Private Key"
          value={privateKey}
          onChange={onChangePrivateKey}
        ></input>
      </label>
      <label>
        Public Key
        <input
          placeholder="Type your Public Key"
          value={publicKey}
          onChange={onChangePublicKey}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
