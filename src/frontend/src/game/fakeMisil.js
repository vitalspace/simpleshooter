'use strict';

import { channel } from "./io";

const fakeMisil = (self) => {
  const createFakeMisil = (x, y, z, speed, parent) => {
    const options = {
      radius: 0.15,
      x: x + 0.2,
      y: y + 1,
      z: 0,
      mass: 20,
      bufferGeometry: true
    }
    const sphere = self.physics.add.sphere(options);
    sphere.body.setBounciness(0.2);
    sphere.body.applyForce(speed, 10, 0)
    sphere.ownerId = parent
    return sphere;
  }
  channel.on('generateBall', async (data) => {
    const { x, y, z, speed, parent } = data
    self.testing  = await createFakeMisil(x, y, z, speed, parent);
  })
}

export {
  fakeMisil
}
