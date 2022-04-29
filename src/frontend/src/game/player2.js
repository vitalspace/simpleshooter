'use strict';

const { ExtendedObject3D } = ENABLE3D;

const player2 = async (self, playerInfo) => {
  const object3d = await self.load.gltf('player');
  const scene = object3d.scenes[0];

  const ply2 = new ExtendedObject3D();
  ply2.add(scene);
  self.add.existing(ply2);

  self.player2 = ply2;

  const scale = 1 / 3
  self.player2.scale.set(scale, scale, scale)

  self.player2.name = playerInfo.playerId
  self.player2.uuid = playerInfo.playerId
  self.player2.position.set(playerInfo.x, playerInfo.y, playerInfo.z)

  
  
  self.player2.traverse(child => {
    if (child.isMesh) {
      child.castShadow = child.receiveShadow = true
    }
  })

  self.playersObject.push(self.player2)
  
  
  // self.physics.add.existing(self.player2, {
  //   shape: 'capsule',
  //   height: 2.2,
  //   // y: -4, 
  //   // width: 0.4, d
  //   // depth: -5, 
  //   offset: { y: -0.7 }
  // })
  
  // self.player2.body.setLinearFactor(1, 1, 0)
  // self.player2.body.setAngularFactor(0, 0, 0)
  // self.player2.body.setFriction(0)

  
  
  // self.player2.body.setCollisionFlags(2)
  
  // // self.player2.body.setVelocityX(playerInfo.x)
  // // self.player2.body.setVelocityY(playerInfo.y)
  // // self.player2.body.setVelocityZ(playerInfo.z)



  // self.player2.position.set(playerInfo.x, playerInfo.y, playerInfo.z)

  // self.player2.body.needUpdate = true

  // // this will run only on the next update if body.needUpdate = true
  // self.player2.body.on.update(() => {
  //   // set body back to dynamic
  //   self.player2.body.setCollisionFlags(0)

  //   // if you do not reset the velocity and angularVelocity, the object will keep it
    
  //   self.player2.body.applyForce(500, 10, 0)
    
  //   self.player2.body.setVelocity(0, 0, 0)
  //   self.player2.body.setAngularVelocity(0, 0, 0)

  // })
  
    console.log('hola')











  // // self.player2.body.setCollisionFlags(2)

  // // set the new position
  // self.player2.body.needUpdate = true

  // // this will run only on the next update if body.needUpdate = true
  // self.player2.body.on.update(() => {
  //   // set body back to dynamic
  //   self.player2.body.setCollisionFlags(0)

  //   // if you do not reset the velocity and angularVelocity, the object will keep it
  //   self.player2.body.setVelocity(0, 0, 0)
  //   self.player2.body.setAngularVelocity(0, 0, 0)
  // })




  //   self.camera.lookAt(self.player2.position);

  // animations
  self.animationMixers.add(self.player2.animation.mixer)
  object3d.animations.forEach(animation => {
    self.player2.animation.add(animation.name, animation)
  })
  self.player2.animation.play('Idle')


  //   // Collisions
  //   self.player2.body.on.collision((otherObject, event) => {
  //     if (otherObject.name === 'plataform' && event === 'start') self.canjump = true;
  //   });

}

export {
  player2
}