import { GameWorld } from './GameWorld';
import { nanoid } from 'nanoid';

/** A Fish, which the Octopus wants to eat. */
export class Fish {
	id: string;

	constructor(
		public world: GameWorld,
		public group: FishGroup,
		public x: number,
		public y: number,
		public health: number
	) {
		this.id = Fish.newId();
		this.world.allFish.set(this.id, this);
	}

	static newId(): string {
		return nanoid();
	}

	/** Returns true if this Fish is currently held by the Octopus's tentacles. */
	underAttack(): boolean {
		// If this is one of the octopus's tentacles, then we're under attack.
		for (let tentacle of this.world.octopus.tentacles) {
			if (tentacle == this) {
				return true;
			}
		}
		return false;
	}

	/** Update the Fish's status. */
	update(): void {
		if (this.health <= 0) {
			// Remove this fish from the group.
			this.group.fishes = this.group.fishes.filter((f) => f != this);
			// Remove this fish from the world.
			this.world.allFish.delete(this.id);
			return;
		}
		if (this.world.prng() < 0.25) {
			let mx = Math.floor(this.world.prng() * this.group.speed);
			if (this.world.prng() < 0.5) {
				mx = -mx;
			}
			let my = Math.floor(this.world.prng() * this.group.speed);
			if (this.world.prng() < 0.5) {
				my = -my;
			}
			this.x = Math.floor(Math.max(0, Math.min(this.x + mx, this.world.width - 1)));
			this.y = Math.floor(Math.max(0, Math.min(this.y + my, this.world.height - 1)));
		}
		// If we are under attack, then move away from the Octopus.
		if (this.underAttack() && this.world.prng() < this.group.fright) {
			const octopus = this.world.octopus;
			if (this.x < octopus.x) {
				this.x = Math.floor(Math.max(0, this.x - this.group.speed));
			}
			if (this.x > octopus.x) {
				this.x = Math.floor(Math.min(this.world.width - 1, this.x + this.group.speed));
			}
			if (this.y < octopus.y) {
				this.y = Math.floor(Math.max(0, this.y - this.group.speed));
			}
			if (this.y > octopus.y) {
				this.y = Math.floor(Math.min(this.world.height - 1, this.y + this.group.speed));
			}
		}
	}
}

/** Represents a group of Fish with the same basic properties, clustered around a center point. */
export class FishGroup {
	fishes: Fish[];
	lastSpawn?: number;

	constructor(
		public world: GameWorld,
		public center_x: number,
		public center_y: number,
		public radius: number,
		public numFishes: number,
		public health: number,
		public value: number,
		public speed: number,
		public fright: number,
		public spawnRate: number
	) {
		this.world = world;
		this.lastSpawn = 0;
		this.fishes = Array.from(Array(numFishes).keys()).map(() => {
			const x = Math.floor(Math.max(0, Math.min(center_x + Math.floor(world.prng() * radius), world.width - 1)));
			const y = Math.floor(Math.max(0, Math.min(center_y + Math.floor(world.prng() * radius), world.height - 1)));
			return new Fish(world, this, x, y, health);
		});
	}

	/** Update all of the Fish in this FishGroup, and spawn new Fish if needed. */
	update(): void {
		for (let fish of this.fishes) {
			fish.update();
		}
		if (this.fishes.length < this.numFishes && this.world.moves - (this.lastSpawn ?? 0) > this.spawnRate) {
			// Spawn a new fish.
			const x = Math.floor(
				Math.max(0, Math.min(this.center_x + Math.floor(this.world.prng() * this.radius), this.world.width - 1))
			);
			const y = Math.floor(
				Math.max(0, Math.min(this.center_y + Math.floor(this.world.prng() * this.radius), this.world.height - 1))
			);
			this.fishes.push(new Fish(this.world, this, x, y, this.health));
			this.lastSpawn = this.world.moves;
		}
	}
}
