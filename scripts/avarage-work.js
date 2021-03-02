const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({data: 'initial'})
let prevTimestamp, nextTimestamp, nextBlock, timeDiff, avarage;

const times = [];

for(let i=0; i<10000; i++){
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    blockchain.addBlock({ data: `block: ${i}`});
    console.log('first block', blockchain.chain[blockchain.chain.length-1])
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;

    times.push(timeDiff)

    avarage = times.reduce((total, num)=> (total+num))/times.length;
    console.log('\x1b[33m%s\x1b[0m', `[FOUND BADCOIN BLOCK] Time to mine block: ${timeDiff}ms & Block Difficulty: ${nextBlock.difficulty}.`)
    console.log('\x1b[36m%s\x1b[0m', `Blocks Found: ${i} & Avarage Time: ${avarage}ms
    `)
 
    
}