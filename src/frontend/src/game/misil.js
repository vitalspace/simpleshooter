'use strict';

import { channel } from "./io";

const misil = async (self) => {

  self.balls = []

  const addMisil = (x, y, z, speedState) => {
    const options = {
      radius: 0.15,
      x: x + 0.2,
      y: y + 1,
      z: 0,
      mass: 20,
      bufferGeometry: true
    };

    const sphere = self.physics.add.sphere(options);
    sphere.body.setBounciness(0.2);
    sphere.body.applyForce(speedState, 10, 0)
    return sphere;
  }

  window.addEventListener('pointerdown', () => {
    const { x, y, z } = self.player.position;

    
    if (self.misilPositionRight) {
      const positiveSpeed = 500;
      self.misil = addMisil(x, y, z, positiveSpeed);
      self.misil.ownerId = self.player.uuid
      const data = {x: x, y: y, z: z, speed: positiveSpeed, parent: self.misil.ownerId};
      channel.emit('createBall', data)
    } else {
      const negativeSpeed = -500;
      self.misil = addMisil(x - 0.5, y, z, negativeSpeed);
      self.misil.ownerId = self.player.uuid
      const data = {x: x - 0.5, y: y, z: z, speed: negativeSpeed, parent: self.misil.ownerId};
      channel.emit('createBall', data)
    }
    // self.balls.push(self.misil);

    // if (self.balls.length >= 10) {
    //   self.balls.forEach(ball => {
    //     self.balls = [];
    //     self.physics.destroy(ball)
    //     ball.visible = false
    //   })
    // } 
  })

  self.misilPositionRight = false;
  self.misilPositionLeft = false;

  document.addEventListener('keydown', e => {
    e.preventDefault()
    const { keyCode } = e;
    if (keyCode === 65) {
      self.misilPositionRight = false;
      self.misilPositionLeft = true;
    }
    if (keyCode === 68) {
      self.misilPositionRight = true;
      self.misilPositionLeft = false;
    }
  })

}



export {
  misil
}