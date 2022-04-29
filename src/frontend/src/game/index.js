'use strict';


import { plataforms } from "./plataforms";
import { multitplayer } from './multiplayer'
import { channel } from "./io";

const { Project, Scene3D, PhysicsLoader, THREE } = ENABLE3D

class MainScene extends Scene3D {

  async preload() {
    await this.load.preload('plataforms', '/src/public/assets/glb/bases.glb');
    await this.load.preload('player', '/src/public/assets/glb/robot.glb');
    await this.load.preload('ball', '/src/public/assets/glb/ball.glb')
  }

  async create() {
    const { light } = await this.warpSpeed('-sky', '-orbitControls', '-ground')

    this.physics.debug.enable()

    this.camera.position.set(0, 5, 20);;
    this.camera.lookAt(0, 0, 0);

    // Resize.
    const resize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      this.renderer.setSize(newWidth, newHeight);
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    }

    window.onresize = resize;
    resize();

    await multitplayer(this);
    await plataforms(this);

    this.canjump = false

    this.keys = {
      w: { isDown: false },
      a: { isDown: false },
      s: { isDown: false },
      d: { isDown: false },
      space: { isDown: false }
    }

    const press = (e, isDown) => {
      e.preventDefault()
      const { keyCode } = e
      switch (keyCode) {
        case 87: // w
          this.keys.w.isDown = isDown
          break
        case 65: // a
          this.keys.a.isDown = isDown
          break
        case 68: // d
          this.keys.d.isDown = isDown
          break
      }
    }
    document.addEventListener('keydown', e => press(e, true))
    document.addEventListener('keyup', e => press(e, false))
  }

  walkAnimation() {
    if (this.player.animation.current !== 'Walking') this.player.animation.play('Walking')
  }

  idleAnimation() {
    if (this.player.animation.current !== 'Idle') this.player.animation.play('Idle')
  }

  async update(time, delta) {

    if (this.player && this.player.body) {

      const { x: px, y: py, z: pz } = this.player.position;

      if (parseInt(py) === -5) {

        this.player.body.setCollisionFlags(2)

        // set the new position
        this.player.position.set(2, 4, 0)
        this.player.body.needUpdate = true

        // this will run only on the next update if body.needUpdate = true
        this.player.body.once.update(() => {
          // set body back to dynamic
          this.player.body.setCollisionFlags(0)

          // if you do not reset the velocity and angularVelocity, the object will keep it
          this.player.body.setVelocity(0, 0, 0)
          this.player.body.setAngularVelocity(0, 0, 0)
        })

      }

      this.camera.position.copy(this.player.position).add(new THREE.Vector3(0, 5, 16))
      // get rotation of robot
      const theta = this.player.world.theta
      this.player.body.setAngularVelocityY(0)
      // set the speed variable
      const speed = 7
      // move left
      if (this.keys.a.isDown) {
        this.player.body.setVelocityX(-speed)
        if (theta > -(Math.PI / 2)) this.player.body.setAngularVelocityY(-10)
        this.walkAnimation()
      }
      // move right
      else if (this.keys.d.isDown) {
        this.player.body.setVelocityX(speed)
        if (theta < Math.PI / 2) this.player.body.setAngularVelocityY(10)
        this.walkAnimation()
      }
      // do not move
      else {
        this.player.body.setVelocityX(0)
        this.idleAnimation()
      }
      // jump
      if (this.keys.w.isDown && this.canjump) {
        this.player.body.setVelocity(0, 7, 0)
        // this.player.body.applyForceY(16)
        this.canjump = false
      }

      //emit player movement
      let x = this.player.body.position.x
      let y = this.player.body.position.y
      let z = this.player.body.position.z
      let r = this.player.body.rotation

      if (this.player.oldPosition &&
        (
          x !== this.player.oldPosition.x ||
          y !== this.player.oldPosition.y - 0.7 ||
          z !== this.player.oldPosition.z ||
          r !== this.player.body.rotation
        )) {
        channel.emit('playerMovement', {
          x: this.player.body.position.x,
          y: this.player.body.position.y - 0.7,
          z: this.player.body.position.z,
          r: this.player.body.rotation
        });
      }

      // save old position data
      this.player.oldPosition = {
        x: this.player.body.position.x,
        y: this.player.body.position.y - 0.7,
        z: this.player.body.position.z,
        r: this.player.body.rotation
      }

    }

    if(this.misil && this.misil.body) {
      const { x, y, z } = this.misil.position 
      if(parseInt(y) === -1 ){
        this.physics.destroy(this.misil)
        this.misil.visible = false
      }
    }


  }

}

PhysicsLoader('/src/public/lib/ammo/kripken', () => new Project({
  scenes: [MainScene], maxSubSteps: 4, fixedTimeStep: 1 / 120
}))