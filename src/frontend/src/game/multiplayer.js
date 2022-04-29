'use strict';

import { channel } from "./io";
import { player } from './player';
import { player2 } from "./player2";
import { misil } from "./misil";
import { fakeMisil } from './fakeMisil'

const multitplayer = async (self) => {

  self.playersObject = [];

  channel.onConnect(error => {});

  channel.on('currentplayers', (players) => {
    Object.keys(players).forEach(async (id) => {
      if (players[id].playerId === channel.id) {
        await player(self, players[id]);
      } else {
        await player2(self, players[id]);
      }
    });
  })

  channel.on('newPlayer', async (playerInfo) => {
    await player2(self, playerInfo);
  });

  channel.on('playerMoved', (playerInfo) => {
    self.playersObject.forEach(players => {
      
      if (playerInfo.playerId === players.uuid) {
        players.position.x = playerInfo.x
        players.position.y = playerInfo.y
        players.position.z = playerInfo.z
        players.rotation.x = playerInfo.r.x
        players.rotation.y = playerInfo.r.y
        players.rotation.z = playerInfo.r.z
      }
    })
  });

  //Create Misil for all players

  misil(self)
  fakeMisil(self);


  channel.on('disconnect', (playerId) => {
    self.playersObject.forEach(players => {
      if (playerId === players.uuid) {
        const actPlayer = self.playersObject.filter(item => item.uuid !== playerId)
        self.playersObject = actPlayer
        self.physics.destroy(players)
        players.visible = false
      }
    })
  });

}

export {
  multitplayer
}