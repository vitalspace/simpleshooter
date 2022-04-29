'use strict';

const { ExtendedObject3D } = ENABLE3D;

const player = async (self, playerInfo) => {
  const object3d = await self.load.gltf('player');
  const scene = object3d.scenes[0];

  const ply = new ExtendedObject3D();
  ply.add(scene);
  self.add.existing(ply);

  self.player = ply;

  const scale = 1 / 3
  self.player.scale.set(scale, scale, scale)

  self.player.name = playerInfo.playerId
  self.player.uuid = playerInfo.playerId
  self.player.position.set(playerInfo.x, playerInfo.y, playerInfo.z)

  self.player.traverse(child => {
    if (child.isMesh) {
      child.castShadow = child.receiveShadow = true
    }
  })

  self.physics.add.existing(self.player, {
    shape: 'capsule',
    height: 2.2, 
    // y: -4, 
    // width: 0.4, d
    // depth: -5, 
    offset: { y: -0.7 }
  })

  self.player.body.setLinearFactor(1, 1, 0)
  self.player.body.setAngularFactor(0, 0, 0)
  self.player.body.setFriction(0)
  
  self.camera.lookAt(self.player.position);

  // animations
  self.animationMixers.add(self.player.animation.mixer)
  object3d.animations.forEach(animation => {
    self.player.animation.add(animation.name, animation)
  })
  self.player.animation.play('Idle')

  // Collisions
  self.player.body.on.collision((otherObject, event) => {
    if (otherObject.name === 'plataform' && event === 'start') self.canjump = true;
  });

}

export {
  player
}