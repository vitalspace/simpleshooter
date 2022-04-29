'use strict';

const { ExtendedObject3D } = ENABLE3D;

const plataforms = async (self) => {
  const object = await self.load.gltf('plataforms');
  const scene = object.scenes[0];

  const plataform = new ExtendedObject3D();
  plataform.add(scene);
  self.add.existing(plataform);

  plataform.traverse(child => {
    if (child.isMesh) {
      self.plataform = child;
      self.plataform.name = 'plataform';
      self.physics.add.existing(child, {
        shape: 'concave',
        mass: 10,
        collisionFlags: 2,
        autoCenter: false
      })
    }
  })
}

export {
  plataforms
}