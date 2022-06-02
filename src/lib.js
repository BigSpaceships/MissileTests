import {Vector3} from 'three';
  
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

export function lerpv3(a, b, t) {
  return new Vector3(lerp(a.x, b.x, t), lerp(a.y, b.y, t), lerp(a.z, b.z, t))
}

export function cubic(p1, p2, p3, p4, t) {
  const quad1 = lerpv3(p1, p2, t);
  const quad2 = lerpv3(p2, p3, t);
  const quad3 = lerpv3(p3, p4, t);

  const linear1 = lerpv3(quad1, quad2, t);
  const linear2 = lerpv3(quad2, quad3, t);

  return lerpv3(linear1, linear2, t);
}