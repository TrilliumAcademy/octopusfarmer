import { GameWorld } from './GameWorld';
import { Fish } from './Fish';

/**
 * Represents the Octopus, which the player's code will control.
 */
export class Octopus {
	tentacles: (Fish | null)[];
	alive: boolean;

	constructor(
		public world: GameWorld,
		public x: number,
		public y: number,
		public speed: number,
		public reach: number,
		public attack: number,
		numTentacles: number
	) {
		this.tentacles = new Array(numTentacles).fill(null);
		this.alive = true;
	}

	/**
	 * Return the next move for the octopus.
	 *
	 * This is the only function that you need to modify. The default
	 * implementation below moves the octopus randomly. Can you do better?
	 */
	nextMove(): { x: number; y: number } {
		const x = this.x + (Math.random() < 0.5 ? 1 : -1) * this.speed * 0.5;
		const y = this.y + (Math.random() < 0.5 ? 1 : -1) * this.speed * 0.5;
		return { x, y };
	}

	/**
	 * Move to the given coordinates, as long as they are within this.speed units away.
	 * Raises an error otherwise.
	 */
	moveTo(x: number, y: number): void {
		if (!this.alive) {
			throw new Error('Cannot move - octopus is not alive');
		}
		if (this.distance(x, y) <= this.speed) {
            // Make sure octopus does not go off the end of the world.
			this.x = Math.max(0, Math.min(this.world.width - 1, x));
			this.y = Math.max(0, Math.min(this.world.width - 1, y));
		} else {
			throw new Error(`Cannot move to coordinates that are more than ${this.speed} units away`);
		}
	}

	/** Return the distance between the octopus and the given coordinates. */
	distance(x: number, y: number): number {
		return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
	}

	/** Return true if the given fish is within this.reach units of this octopus. */
	canReach(fish: Fish): boolean {
		return this.distance(fish.x, fish.y) <= this.reach;
	}

	/** Update the state of this octopus on each game step. */
	update(): void {
		// If the octopus is dead, just return.
		if (!this.alive) {
			return;
		}

		let { x, y } = this.nextMove();
        this.moveTo(x, y);

		// If octopus gets too close to a trap, it dies.
		for (let trap of this.world.traps) {
			if (this.distance(trap.x, trap.y) < trap.radius) {
				this.alive = false;
				return;
			}
		}

		// Check whether any fish have gone out of range.
		for (let tentacle of this.tentacles) {
			if (tentacle && !this.canReach(tentacle)) {
				// Fish goes out of range and immediately heals.
				tentacle.health = tentacle.group.health;
				const index = this.tentacles.indexOf(tentacle);
				if (index != -1) {
					this.tentacles[index] = null;
				}
			}
		}

		// Sort fish by distance.
		let fishByDistance: Fish[] = [];
		for (let fishGroup of this.world.fishGroups) {
			for (let fish of fishGroup.fishes) {
				if (this.canReach(fish)) {
					fishByDistance.push(fish);
				}
			}
		}
		fishByDistance.sort((a, b) => this.distance(a.x, a.y) - this.distance(b.x, b.y));

		// Grab any fish that we don't already have in our tentacles.
		for (let fish of fishByDistance) {
			// If none of the entries of tentacles are null, can't grab any more.
			if (this.tentacles.every((tentacle) => tentacle !== null)) {
				break;
			}
			// Can't grab a fish twice.
			if (this.tentacles.indexOf(fish) != -1) {
				continue;
			}
			// Grab fish with the first empty tentacle.
			this.tentacles[this.tentacles.indexOf(null)] = fish;
		}

		// Attack any fish that we have in our tentacles.
		for (let tentacle of this.tentacles) {
			if (tentacle && tentacle.health > 0) {
				tentacle.health -= this.attack;
				if (tentacle.health <= 0) {
					// We killed a fish. It will be removed from the world on the next update.
					this.world.score += tentacle.group.value;
					// Remove this fish from our tentacles.
					const index = this.tentacles.indexOf(tentacle);
					if (index != -1) {
						this.tentacles[index] = null;
					}
				}
			}
		}
	}
}
