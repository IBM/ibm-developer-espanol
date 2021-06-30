module.exports = {
    name : 'ping',
    desc: 'this is a ping command',
    execute(msg, args){
        msg.channel.send('pong!');
    }
}