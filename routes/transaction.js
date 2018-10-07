var express = require('express');
var router = express.Router();
const bitcoin = require('../blockchain');
const axios = require('axios');
const {normalizeError} = require('../utils');
const brodacastPeer = async (newNodeAddress)=>{
    let peers = bitcoin.getPeers();

    for(let peer of peers){
        console.log(`trying to broadcast to ${peer}`)

        await axios.post(`http://${peer}/api/peer/register`,{nodeAddress:newNodeAddress})
        console.log(`brodacasted to ${peer}`)
    }

}


const brodacastTransaction = async (transaction)=>{
    let peers = bitcoin.getPeers();

    for(let peer of peers){
        console.log(`trying to broadcast to ${peer}`)

        await axios.post(`http://${peer}/api/transaction/create`,{transaction:transaction})
        console.log(`brodacasted to ${peer}`)
    }

}
router.post('/create', async (req,res) =>{
    let transaction = req.body.transaction;
    let txnId = bitcoin.addNewTransaction(transaction);
    return  res.send({txnId});

})

router.post('/create-broadcast', async (req,res) =>{
    let payload = req.body;

    let transaction = {
        amount : payload.amount,
        from : payload.from,
        to : payload.to,
        fee : payload.fee
    }
    if(!transaction.fee || !transaction.from || !transaction.to){
       return res.status(400).send({message:'invalid payload'});
    }
    await brodacastTransaction(transaction)
    let txnId = bitcoin.addNewTransaction(transaction);

    return  res.send({message:'broascasred', txnId});

})

module.exports = router;