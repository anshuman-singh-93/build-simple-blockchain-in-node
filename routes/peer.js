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


const brodacastTransaction = async (newNodeAddress)=>{
    let peers = bitcoin.getPeers();

    for(let peer of peers){
        console.log(`trying to broadcast to ${peer}`)

        await axios.post(`http://${peer}/api/peer/register`,{nodeAddress:newNodeAddress})
        console.log(`brodacasted to ${peer}`)
    }

}
router.get('/', async (req,res) =>{
    return res.send({peers:bitcoin.getPeers()})
})


router.post('/register-broadcast', async (req,res) =>{
    let nodeAddress = req.body.nodeAddress;
    if(bitcoin.getPeers().includes(nodeAddress)){
        return res.status(400).send({message:'this node is already added'});
    }
    if(!nodeAddress){
        return res.status(400).send({message:'ip address is invalid'});
    }
    

    try{
        await brodacastPeer(nodeAddress);
        await axios.post(`http://${nodeAddress}/api/peer/register-node-bulk`,
        {nodeAddresses:[...bitcoin.getPeers(),bitcoin.currentNodeAddress]})
        bitcoin.addPeer(nodeAddress);

    }
    catch(err){
        return res.status(400).send({message:normalizeError(err)})

    }
    return res.send({peers:bitcoin.getPeers()})
})



router.post('/register', async (req,res) =>{
    let nodeAddress = req.body.nodeAddress;
    if(!bitcoin.getPeers().includes(nodeAddress)){
        bitcoin.addPeer(nodeAddress);
    }
 
    return res.send({peers:bitcoin.getPeers()})
})


router.post('/register-node-bulk', async (req,res) =>{
    let nodeAddresses = req.body.nodeAddresses;
    
    for(let nodeAddress of nodeAddresses){
        if(!bitcoin.getPeers().includes(nodeAddress)){
            bitcoin.addPeer(nodeAddress);
        }
    }
    
 
    return res.send({peers:bitcoin.getPeers()})
})

module.exports = router;