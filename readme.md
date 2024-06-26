# ECDSA Node Application

This project is a simple ECDSA (Elliptic Curve Digital Signature Algorithm) based application designed to facilitate the transfer of balances between accounts. The frontend is built using React, and it communicates with a server to process transactions securely. The project aims to demonstrate the use of public key cryptography to ensure that only the owner of the corresponding private key can authorize transactions from an account.
 
## Features

### Frontend

**1. Wallet Component**

* Allows users to input their wallet address, private key, and public key.
* Displays the balance of the entered wallet address.
* Validates ETH address format and key lengths.
  
**2. Transfer Component**

* Enables users to send transactions to other accounts.
* Validates transaction inputs, including recipient address, amount, and key formats.
* Verifies that the public key matches the provided ETH address before processing the transaction.
* Displays transaction details in the console for debugging.

**3. Input Validations**

* Checks the format of ETH addresses.
* Ensures the public key and private key have correct lengths.
* Validates that the send amount is a positive number.
* Confirms that the recipient address is not the same as the sender address.

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173  

### Server Side Functionality

**1. Transaction Processing**

* Receive Requests: Listens for transaction requests at /send.
* Validate Signature: Uses verifySignature to ensure the transaction's authenticity.
* Verify Address: Derives and checks the sender's address using getEthAddress.
* Check Balance: Ensures the sender has sufficient funds.
* Update Balances: Adjusts the sender's and recipient's balances and records the transaction.


**2. Balance Inquiry**

* Get Balance: Retrieves the current balance of a given address via /balance/:address.


**3.Transaction History**

* Get Transactions: Provides transaction history for a specific address through /transactions/:address.
  
This setup ensures secure transaction validation, accurate balance management, and accessible transaction histories.

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.  
_Hint_ - Test wallets data is stored in the file wallets.txt.
