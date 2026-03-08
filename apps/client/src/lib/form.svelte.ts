export interface Actor {
	name: string;
	scenes: boolean[];
	availability: number;
	payment: number;
}

export type Dislike = [string | undefined, string | undefined];

export class FormState {
	complex = $state(true);
	actors = $state(createActors(5, 5));
	scenes = $state(Array<number>(5).fill(1));
	dislikes: Dislike[] = $state([[undefined, undefined]]);

	constructor() {
		// console.log(this);
	}

	addActor() {
		this.actors.push({
			availability: 0,
			name: `Actor ${this.actors.length + 1}`,
			payment: 1,
			scenes: Array.from({ length: this.scenes.length }).map((_) => false)
		});
		// console.log(this.actors);
	}

	removeActor() {
		if (this.actors.length <= 1) return;
		this.actors.pop();
	}

	addScene() {
		this.scenes.push(1);
		this.actors.forEach((actor) => actor.scenes.push(false));
		// console.log(this.scenes);
	}

	removeScene() {
		if (this.scenes.length <= 1) return;
		this.scenes.pop();
		this.actors.forEach((actor) => actor.scenes.pop());
	}

	addDislike() {
		this.dislikes.push([undefined, undefined]);
	}

	toggleScene(actorIndex: number, sceneIndex: number) {
		this.actors[actorIndex].scenes[sceneIndex] = !this.actors[actorIndex].scenes[sceneIndex];
	}

	removeDislike() {
		if (this.dislikes.length <= 1) return;
		this.dislikes.pop();
	}

	/*
  setScenesNumber(scenes: number) {
    const diff = scenes - this.scenes.length;
    const start = diff >= 0 ? this.scenes.length : this.scenes.length - scenes;

    this.actors.forEach((actor) =>
      actor.scenes.splice(
        start,
        Infinity,
        ...Array.from({ length: diff }).map((_) => false),
      ),
    );
    this.scenes.splice(
      start,
      Infinity,
      ...Array.from({ length: diff }).map((_) => 1),
    );
  }

  setActorsNumber(actors: number) {
    const diff = actors - this.actors.length;
    const start = diff >= 0 ? this.scenes.length : this.scenes.length - scenes;
    const diff = this.actors.length;
    this.actors.forEach((actor) =>
      actor.scenes.splice(
        diff,
        Infinity,
        ...Array.from({ length: diff }).map((_) => false),
      ),
    );
  }
    */
}

function createActors(count: number, scenes: number): Actor[] {
	return Array.from({ length: count }, (_, i) => ({
		name: `Actor ${i + 1}`,
		scenes: Array(scenes).fill(false),
		availability: 0,
		payment: 1
	}));
}

function setArrayLength<T>(array: T[], desiredLength: number, defaultValue: T) {
	return [...array, ...Array(Math.max(0, desiredLength - array.length)).fill(defaultValue)].slice(
		0,
		desiredLength
	);
}

export function buildDznString(
	actors: Actor[],
	scenes: number[],
	dislikes: Dislike[],
	complex: boolean
): string {
	const actorNames = actors.map((a) => a.name.replace(/ /g, '_'));

	let dzn = `ACTORES = {${actorNames.join(', ')}};\n\n`;
	dzn += 'Escenas =\n[|';

	actors.forEach((actor, i) => {
		const scenes = actor.scenes.map((s) => (s ? '1' : '0')).join(', ');
		dzn += `${scenes}, ${actor.payment}\n |`;
	});
	dzn += '];\n\n';
	dzn += `Duracion = [${scenes.join(', ')}];`;

	if (complex) {
		let dzn2 = '\n\nDisponibilidad =\n[|';
		actors.forEach((actor, i) => {
			dzn2 += `${actorNames[i]}, ${actor.availability}\n |`;
		});
		dzn2 += '];\n\nEvitar =\n[|';

		let hasDislikes = false;
		dislikes.forEach((pair) => {
			if (pair[0] && pair[1] && pair[0] !== pair[1]) {
				const name0 = pair[0].replace(/ /g, '_');
				const name1 = pair[1].replace(/ /g, '_');
				dzn2 += `${name0}, ${name1}\n |`;
				hasDislikes = true;
			}
		});
		dzn2 += hasDislikes ? '];' : '|];';

		dzn += dzn2;
	}

	return dzn;
}

export function parseSolution(data: string) {
	const re = /([\w_]+)\s=\s[\{|\[](.*)[\}|\]]/;
	const re2 = /([\w_]+)\s=\s(\d+)/;
	const items = data
		.split(';\n')
		.map((item, idx) => {
			const regres = re.exec(item) || re2.exec(item);
			if (regres === null) return null;
			const [_, key, value] = regres;
			switch (key) {
				case 'ACTORES':
					return [key, value.split(', ')] as const;
				case 'costo_total':
				case 'tiempo_compartido':
					return [key, Number(value)] as const;
				default:
					return [key, value.split(', ').map((e) => Number(e))] as const;
			}
		})
		.filter((v): v is NonNullable<typeof v> => !!v);
	return Object.fromEntries(items) as {
		ACTORES: string[];
		costo_total: number;
		orden_escenas: number[];
		start_time: number[];
		end_time: number[];
		actor_start_time: number[];
		actor_end_time: number[];
		tiempo_en_set: number[];
		sueldo_actor: number[];
	};
}
