export interface ScenesActor {
  name: string;
  scenes: boolean[];
  availability: number;
  payment: number;
}

export class ScenesActor implements ScenesActor {
  availability = 0;
  payment = 1;

  constructor(name: string, scenes: number) {
    this.name = name;
    this.scenes = Array(scenes).fill(false);
  }
}

export function scenesActors(actors: number, scenes: number) {
  return Array.from({ length: actors }, (v, i) => (new ScenesActor(("Actor " + (i + 1)), scenes)));
}
