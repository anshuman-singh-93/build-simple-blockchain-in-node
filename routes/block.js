var express = require('express');
var router = express.Router();
const bitcoin = require('../blockchain');
const axios = require('axios');
const {normalizeError} = require('../utils');




router.post('/receive', async (req,res) =>{
    let block = req.body.block;
    if(bitcoin.doesBlockHasPow(block)){
        let previousBlockHash = bitcoin.hashBlockHeader(bitcoin.getLastBlock().header);
        if(bitcoin.hashBlockHeader(block.header) === previousBlockHash){
            bitcoin.addNewBlock(block)
        }
    }


})

module.exports = router;