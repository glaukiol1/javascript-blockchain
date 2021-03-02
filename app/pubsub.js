const redis = require('redis');
const { parse } = require('uuid');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
}

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscribeToChannels();
        this.subscriber.on('message',(channel, message)=>{this.handleMessage(channel, message)})
    }
    handleMessage(channel, message) {
        console.log(`Message Recived. Channel: ${channel}. Message: ${message}`)

        const parsedMessage = JSON.parse(message);
        switch(channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, (successChain)=>{
                    this.transactionPool.clearBlockchainTransactions({
                        chain: successChain
                    })
                })
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }
    }
    subscribeToChannels() {
        Object.values(CHANNELS).forEach(r=>{
            this.subscriber.subscribe(r)
        })
    }

    publish({channel, message}){
        this.subscriber.unsubscribe(channel, ()=>{
            this.publisher.publish(channel, message, ()=>{
                this.subscribeToChannels()
            })
        })
    }

    broadcastChain(){
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }
}

module.exports = PubSub;