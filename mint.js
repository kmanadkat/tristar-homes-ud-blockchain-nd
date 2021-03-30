const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const infuraKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
const mnemonic = "xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx xxxxxx";

const contractAdd = "0xa535BE600BfD7401101b7377Fb994B583581fB14";
const contractOwner = "0xca2ceb85734dF92E8d78360d9658A81232Be4622";
const contractABI = [{
  "constant": false,
  "inputs": [
    {
      "name": "solVerifiedUser",
      "type": "address"
    },
    {
      "name": "tokenId",
      "type": "uint256"
    },
    {
      "name": "a",
      "type": "uint256[2]"
    },
    {
      "name": "b",
      "type": "uint256[2][2]"
    },
    {
      "name": "c",
      "type": "uint256[2]"
    },
    {
      "name": "input",
      "type": "uint256[2]"
    }
  ],
  "name": "verifiedMint",
  "outputs": [
    {
      "name": "isMinted",
      "type": "bool"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}];

const NUM_TOKENS = 10;
const provider = new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`)
const web3 = new Web3(provider);


const mintTokens = async () => {

  // Initialize Contract
  const contract = new web3.eth.Contract(contractABI, contractAdd, {
    from: contractOwner,
  })

  // Mint tokens
  for (let i = 0; i < NUM_TOKENS; i++) {
    // Prep Proof
    let fileName = `proof${i+1}.json`;
    let proof = JSON.parse(fs.readFileSync(`${__dirname}/proofs/${fileName}`));
    
    // Mint Token
    const result = await contract.methods.verifiedMint(
      contractOwner,
      i,
      proof.proof.a,
      proof.proof.b,
      proof.proof.c,
      proof.inputs
    ).send({from: contractOwner});

    // Display Minted Token Tx Hash
    console.log(`Minted Token ${i} Tx Hash : ${result.transactionHash}`);
  }
}

mintTokens();