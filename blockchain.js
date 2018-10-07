const crypto = require('crypto');
const uuidv4 = require('uuid/v4');

function Blockchain(){
    this.chain=[];
    this.pendingTransactions=[];
    this.target=1;
    this.version=1;
    this.minerAward=25;
    this.height=0;
    this.fee=10;
    this.peers=[];
    this.miningInProcess = false;
    this.nodeAddress,
    this.currentNodeAddress=null;
}

Blockchain.prototype.createGensisBlock = function () {
    let block = this.createCandidateBlock(null);
    block = this.mineBlock(block);
    // after  creating genesis block increase difficulty
    this.target=4;
}

Blockchain.prototype.getPeers = function () {
    return this.peers;
}

Blockchain.prototype.addPeer = function (nodeAddress) {
    this.peers.push(nodeAddress);
}

Blockchain.prototype.addNewBlock = function (newBlock) {
    this.chain.push(newBlock);
    this.height++;
}


Blockchain.prototype.getLastBlock = function () {
    //
    return this.chain[this.chain.length-1];
    
}


Blockchain.prototype.addNewTransaction = function (transaction) {
    //
   
    transaction.txnId = uuidv4().replace(/-/g, '')
    this.pendingTransactions.push(transaction)
    return transaction.txnId;
    
}


Blockchain.prototype.getBlockchain = function (){
    //
    return {
        blocks:this.chain, 
        height:this.height,
        currentNodeAddress:this.currentNodeAddress,
        peers:this.peers,
        pendingTransactions:this.pendingTransactions
    };
}


Blockchain.prototype.addCoinbaseTranaction = function (){

    console.log('coinbase transaction has been added');
    let award = this.minerAward + this.fee;

    let transaction = {
        amount:award,
        from:null,
        to:this.currentNodeAddress,
        fee:this.fee
    }
    this.addNewTransaction(transaction)
   
}


Blockchain.prototype.createCandidateBlock = function (previousBlockHeaderHash){
    this.addCoinbaseTranaction();
    const newBlock = {
        header:{
            version:this.version,
            previousBlockHeaderHash,
            timestamp:new Date().toUTCString(),
            target:this.target,
            merkleRoot:this.getMerkleRoot(this.pendingTransactions),
            nonce:0,
        },
        transactions : this.pendingTransactions,
        transactionCounter : this.pendingTransactions.length
    }
    this.pendingTransactions =[];
    return newBlock;
}


Blockchain.prototype.getMerkleRoot = function (transactions) {

    let hash = crypto.createHash('sha256');
    let merkleRootHash=null;

    if(transactions.length){
        for (let transaction of transactions){
            hash = hash.update(JSON.stringify(transaction));
        }
        merkleRootHash = hash.digest('hex');
    }
   

    return merkleRootHash;
}


Blockchain.prototype.hashBlockHeader = function (blockHeader) {
    //
    let hash = crypto.createHash('sha256');
    hash = hash.update(JSON.stringify(blockHeader));
    hash = hash.digest('hex');
    return hash;

}


Blockchain.prototype.mineBlock = function (block) {
        block =  this.proofOfWork(block);
        return block

}


Blockchain.prototype.proofOfWork = function (block) {
    block.header.nonce=1;
    let hash = this.hashBlockHeader(block.header)

    while(hash.substring(0,this.target) !== '0'.repeat(this.target)){
        block.header.nonce++;
        hash = this.hashBlockHeader(block.header);
    }
    console.log(`mining finished and nonce is ${block.header.nonce}`)

    return block;
}


Blockchain.prototype.doesBlockHasPow = function (block) {
    let is_block_valid = true;
    let blockHeader = block.header;
    let hash = this.hashBlockHeader(blockHeader)
    if(hash.substring(0,this.target) !== '0'.repeat(this.target)){
      is_block_valid = false;
    }

    return is_block_valid;
}


module.exports= new Blockchain();