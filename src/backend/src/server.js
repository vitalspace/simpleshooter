// import other libraries as CJS
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const port = 4000

const main = async () => {
  // import geckos as ESM
  const { geckos } = await import('@geckos.io/server')
  const io = geckos()

  let players = {};

  io.addServer(server)
  io.onConnection(channel => {

    console.log(`${channel.id} got connected`)

    players[channel.id] = {
      x: 2,
      y: 2,
      z: 0,
      // r: 0,
      playerId: channel.id,
    }

    channel.emit('currentplayers', players);

    channel.broadcast.emit('newPlayer', players[channel.id]);

    channel.on('playerMovement', (movementData) => {
      players[channel.id].x = movementData.x;
      players[channel.id].y = movementData.y;
      players[channel.id].z = movementData.z;
      players[channel.id].r = movementData.r;
      // emit a message to all players about the player that moved
      channel.broadcast.emit('playerMoved', players[channel.id]);
    });

    channel.on('createBall', (data) => {
      channel.broadcast.emit('generateBall', data);
    });

    channel.onDisconnect(() => {
      delete players[channel.id];
      console.log(`${channel.id} got disconnected`)
      channel.room.emit('disconnect', channel.id);
    })

  })

  server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

main()
