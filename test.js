const Blockchain = require('./blockchain');
const bitcoin = new Blockchain();

bitcoin.addNewTransaction({
    amount:1,
    sender:'',
    recepient:''
})

bitcoin.constructNewBlock(bitcoin.hashBlockHeader(bitcoin.getLastBlock().header))

bitcoin.constructNewBlock(bitcoin.hashBlockHeader(bitcoin.getLastBlock().header))
