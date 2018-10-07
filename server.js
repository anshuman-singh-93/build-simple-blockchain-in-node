var http = require('http')
var express = require('express')
const uuidv4 = require('uuid/v4');
var logger = require('morgan')
var bodyParser = require('body-parser')
var errorHandler = require('errorhandler')
var app = express();
const peerEndpoint = require('./routes/peer');
const transactionEndpoint = require('./routes/transaction');
const axios = require('axios');

const bitcoin = require('./blockchain');

bitcoin.nodeAddress = uuidv4().replace(/-/g, '');
bitcoin.createGensisBlock();


// all environments
app.set('port', process.argv[2])
bitcoin.currentNodeAddress = `localhost:${process.argv[2]}`;

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))


var server = http.createServer(app)
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'))
})

const brodacastBlock = async (block) => {
    let peers = bitcoin.getPeers();

    for (let peer of peers) {
        console.log(`trying to broadcast to ${peer}`)

        await axios.post(`http://${peer}/api/block/receive`, {
            block: block
        })
        console.log(`brodacasted to ${peer}`)
    }

}

const mine = async () => {
    let pendingTxns = bitcoin.pendingTransactions;
    if (pendingTxns.length > 1 && !bitcoin.miningInProcess) {
        // mine block
        bitcoin.miningInProcess = true;

        let previousBlockHeaderHash = bitcoin.hashBlockHeader(bitcoin.getLastBlock().header)

        let block = bitcoin.createCandidateBlock(previousBlockHeaderHash);
        block = bitcoin.mineBlock(block);
        await brodacastBlock(block)
        bitcoin.miningInProcess = false;
    } else {
        console.log(`no block to mine- pending txn is ${pendingTxns.length}`)
    }
}


setInterval(mine, 10000)

app.get('/api/getBlockchain', (req, res) => {
    res.send(bitcoin.getBlockchain());
})




app.use('/api/transaction', transactionEndpoint);

app.use('/api/peer', peerEndpoint);