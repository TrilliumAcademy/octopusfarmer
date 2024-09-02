import seedrandom, { StatefulPRNG, State } from 'seedrandom';

import { Fish, FishGroup } from './Fish';
import { Octopus } from './Octopus';

/** The game difficulty level. */
export type GameType = 'test' | 'easy' | 'normal' | 'hard' | 'insane';

/** Represents a trap in which the octopus can get caught. */
export type Trap = {
	/** The x position of the trap. */
	x: number;
	/** The y position of the trap. */
	y: number;
	/** The reach of the trap. */
	radius: number;
};

/** Represents the game world. */
export class GameWorld {
	/** The type of game. */
	gameType: GameType;
	/** The current number of moves in this game world. */
	moves: number;
	/** The current score for this game. */
	score: number;
	/** The width of the world in cells. */
	width: number;
	/** The height of the world in cells. */
	height: number;
	/** The state of the octopus. */
	octopus: Octopus;
	/** The groups of fishies. */
	fishGroups: FishGroup[];
	/** The traps that the octopus should avoid. */
	traps: Trap[];

	/** Maps from a fish ID to an individual fish. */
	allFish: Map<string, Fish>;
	/** A pseudorandom number generator used to generate random numbers. */
	prng: StatefulPRNG<State.Arc4>;

	// Generate a starting coordinate that is within 'minRadius' and `maxRadius` units of the
	// given x, y position. This allows us to place the fish and traps away from the starting
	// position of the octopus.
	safeCoord = (x: number, y: number, minRadius: number, maxRadius: number) => {
		// Generate a random angle.
		const theta = this.prng() * 2 * Math.PI;
		// Generate a random radius.
		const r = this.prng() * (maxRadius - minRadius) + minRadius;
		// Convert back to cartesian coordinates.
		const x2 = Math.floor(r * Math.cos(theta));
		const y2 = Math.floor(r * Math.sin(theta));
		return { x: x + x2, y: y + y2 };
	};

	/**
	 * Initialize a game world instance.
	 */
	constructor(gameType?: GameType, seed?: number) {
		this.gameType = gameType ?? 'normal';
		this.allFish = new Map();
		this.prng = seedrandom(seed ? seed.toString() : undefined, { state: true });
		this.moves = 0;
		this.score = 0;

		console.log(`Creating new game - gameType ${this.gameType}, seed ${seed}`);
		switch (gameType) {
			case 'test':
				// The test game is a 500x500 world with a single fish group
				// in the upper left corner, and a single trap between the octopus
				// and the fish group.
				this.width = 500;
				this.height = 500;
				this.octopus = new Octopus(this, 250, 250, 4, 20, 25, 4);
				this.fishGroups = [new FishGroup(this, 25, 25, 50, 20, 100, 1, 10, 0.25, 1)];
				this.traps = [{ x: 150, y: 150, radius: 50 }];
				break;

			case 'easy':
				// Easy game is 500x500, with three fish groups, no traps.
				this.width = 500;
				this.height = 500;
				this.octopus = new Octopus(this, 250, 250, 4, 20, 25, 8);
				this.fishGroups = [
					new FishGroup(this, Math.floor(this.prng() * 500), Math.floor(this.prng() * 500), 15, 20, 25, 10, 4, 0.1, 2),
					new FishGroup(
						this,
						Math.floor(this.prng() * 500),
						Math.floor(this.prng() * 500),
						20,
						10,
						100,
						20,
						12,
						0.2,
						5
					),
					new FishGroup(
						this,
						Math.floor(this.prng() * 500),
						Math.floor(this.prng() * 500),
						30,
						5,
						200,
						100,
						18,
						0.4,
						10
					),
				];
				this.traps = [];
				break;
			case 'normal':
				// Normal game is 500x500, with five fish groups and three traps.
				this.width = 500;
				this.height = 500;
				this.octopus = new Octopus(this, 250, 250, 10, 50, 25, 8);
				this.fishGroups = [
					new FishGroup(this, Math.floor(this.prng() * 500), Math.floor(this.prng() * 500), 15, 20, 25, 10, 4, 0.1, 2),
					new FishGroup(
						this,
						Math.floor(this.prng() * 500),
						Math.floor(this.prng() * 500),
						20,
						10,
						100,
						20,
						12,
						0.2,
						5
					),
					new FishGroup(
						this,
						Math.floor(this.prng() * 500),
						Math.floor(this.prng() * 500),
						30,
						5,
						200,
						100,
						18,
						0.4,
						10
					),
					new FishGroup(this, Math.floor(this.prng() * 500), Math.floor(this.prng() * 500), 15, 20, 25, 12, 4, 0.1, 2),
					new FishGroup(this, Math.floor(this.prng() * 500), Math.floor(this.prng() * 500), 15, 20, 25, 15, 4, 0.1, 2),
				];
				this.traps = [
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
				];
				break;

			case 'hard':
				// Hard game is 500x500, with one fish group, and three large traps.
				this.width = 500;
				this.height = 500;
				this.octopus = new Octopus(this, 250, 250, 4, 20, 25, 8);
				this.fishGroups = [
					new FishGroup(
						this,
						Math.floor(this.prng() * 500),
						Math.floor(this.prng() * 500),
						200,
						50,
						100,
						100,
						10,
						0.5,
						1
					),
				];
				this.traps = [
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 75 },
					{ ...this.safeCoord(250, 250, 150, 200), radius: 100 },
				];
				break;

			case 'insane':
				// Insane game is 500x500, with one fish and 6 traps!
				this.width = 500;
				this.height = 500;
				this.octopus = new Octopus(this, 250, 250, 10, 20, 25, 8);
				this.fishGroups = [
					new FishGroup(
						this,
						Math.floor(this.prng() * 500),
						Math.floor(this.prng() * 500),
						25,
						1,
						10000,
						1000,
						30,
						0.5,
						1
					),
				];
				this.traps = [
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
					{ ...this.safeCoord(250, 250, 100, 200), radius: 50 },
				];
				break;

			default:
				throw new Error(`Unknown game type ${gameType}`);
		}
	}

	/** Update the state of the world. */
	update(): void {
		this.moves++;
		for (let fishGroup of this.fishGroups) {
			fishGroup.update();
		}
		this.octopus.update();
	}

	/** Returns all Fish in the world. */
	fishes(): Fish[] {
		let fishes: Fish[] = [];
		for (let fishGroup of this.fishGroups) {
			fishes = fishes.concat(fishGroup.fishes);
		}
		return fishes;
	}

	/** Return the fish with the given ID. */
	fishById(id: string): Fish {
		const fish = this.allFish.get(id);
		if (!fish) {
			throw new Error(`No fish with ID ${id}`);
		}
		return fish;
	}
}
