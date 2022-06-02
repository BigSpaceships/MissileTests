import {Vector3} from 'three';
import {cubic} from './lib.js'

export class Missile {
  
  constructor(pos, rotation, initial, target, height, model) {

    model.children[0].position.sub(new Vector3(0, .75, 0))
    
    this.SPEED = 400
    
    this.initial = initial;
    this.target = target;

    this.target.add(new Vector3(0, 5, 0))
    
    this.height = height;

    this.velocity = new Vector3(0, 0, 0)

    this.object = model.clone();

    this.object.position.copy(pos.sub(new Vector3(0, 1.5, 0)));
    this.object.rotation.copy(rotation)

    this.time = 0;

    this.ceiling = Math.max(this.initial.y, this.target.y) + this.height;
  }

  tick() {
    this.time++;

    this.updatePos()
    this.updateRotation()
  }

  updatePos() {
    let v2 = this.initial.clone()
    v2.y = this.ceiling;

    let v3 = this.target.clone()
    v3.y = this.ceiling;

    const target = cubic(this.initial, v2, v3, this.target, this.time / this.SPEED)

    let oldVelocity = this.velocity === undefined ? new Vector3(0, 0, 0) : this.velocity.clone()
    
    this.velocity.subVectors(target, this.object.position)

    if (this.time >= this.SPEED) {
      this.velocity.copy(oldVelocity)
    }

    this.object.position.add(this.velocity)
  }

  updateRotation() {
    // x is pitch
    // z is yaw

    const yaw = Math.atan2(this.velocity.x, this.velocity.z);
    const pitch = Math.atan2(this.velocity.y, Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z)) - Math.PI / 2;

    this.object.rotation.set(0, 0, 0);
    this.object.rotateX(-pitch)
    this.object.rotateOnWorldAxis(new Vector3(0, 1, 0), yaw)
  }
}