/**
 * This file contains type definitions for the game state.
 */

/** Represents a game. */
export type GameData = {
	/** The unique game ID. */
	gameId: string;
	/** The date and time this game was created. */
	created: string;
	/** The date and time this game was last modified. */
	modified: string;
	/** The current world state for this game. */
	world: WorldData;
};

/** Represents the world state for a given game. */
export type WorldData = {
	/** The width of the world in cells. */
	width: number;
	/** The height of the world in cells. */
	height: number;
	/** The current number of moves made in this game. */
	moves: number;
	/** The current player score. */
	score: number;
	/** The state of the octopus. */
	octopus: OctopusData;
	/** The fish that the octopus is trying to capture. */
	fish: FishData[];
};

/** Represents the state of the octopus. */
export type OctopusData = {
	/** The current x position of the octopus. */
	x: number;
	/** The current y position of the octopus. */
	y: number;
	/** The maximum number of units that the octopus can move in a single turn. */
	speed: number;
	/** The maximum number of units that each of the octopus' tentacles can reach. */
	reach: number;
	/** The amount of damage done by each tentacle in a single turn. */
	attack: number;
	/** The state of each tentacle. */
	tentacles: TentacleData[];
};

/** Represents a single tentacle of the octopus. */
export type TentacleData = {
	/**
	 * A tentacle can either be grabbing a fish, in which case the fish's ID is stored here,
	 * or it can be grabbing nothing, in which case this value is null.
	 */
	fishId: string | null;
};

/** Represents a single fish. */
export type FishData = {
	/** The unique ID of the fish. */
	id: string;
	/** The current x position of the fish. */
	x: number;
	/** The current y position of the fish. */
	y: number;
	/** The current health of the fish. */
	health: number;
};

/** Represents a move that the octopus can make. */
export type MoveData = {
	/**
	 * The number of moves made in this game so far. Must match the world's `moves` parameter
	 * for the proposed move to be considered valid.
	 */
	moves: number;
	/** The proposed position of the octopus. */
	octopus: OctopusPosition;
};

/** Represents a proposed position for the octopus to move. */
export type OctopusPosition = {
	/** The proposed x position of the octopus. */
	x: number;
	/** The proposed y position of the octopus. */
	y: number;
};
