# AwesomeStars Ethereum Smart Contract, Token ERC721 
**PROJECT: Decentralized Star Notary Service Project**

### Token Name and Symbol
```bash
# Token name
AwesomeStars 
# Token Symbol
AWS
```


### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```

2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```


2. **Metamask: 10.X.X** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


4. **Other mandatory packages**:
```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@^4.6.0
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```

### Important
We have deployed this Contract to the Goerli Testnet, please find our contract and token address below.

| Network | Contract Address |
|---|---|
|Goerli Network| 0xa80E6925B9b954389D9302BAeE47093CC9F5A419 |

To run the frontend see below.
```bash
cd app
node index.js
```
