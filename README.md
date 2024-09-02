# Octopus Farmer 🐙🌱

This is a web-based game in which you play as an octopus that attempts to catch fish
with its tentacles. Each fish consumed gives you a certain number of points, and your goal is
to maximize the number of points you get within a certain number of time steps, by writing the
best code you can to optimize the octopus's movement.

The world also consists of a set of circular *traps* that the octopus must avoid. If the octopus
touches a trap, the game is over.

Your job is to modify the code in `src/lib/Octopus.ts` to get the best score you can within
a certain number of game steps, by catching the most valuable fish, and avoiding the traps.

## Contents of this repository

This is a React app, written using TypeScript, Next.js, and Tailwind CSS.

The file `src/lib/GameWorld.ts` has the main file describing the game world, which consists
of some fish, traps, and an octopus.

You'll find the code for the octopus in `src/lib/Octopus.ts`. This is the file you'll need to
modify for your solution. The function `nextMove()` is called each time step. Your job is to
modify this function to make the octopus move in the most optimal way possible.
**You should not modify any other code in this tree!**

The code in `src/app` consists of the web UI for the game, which shows the game world in a
canvas element and provides a few controls for starting a new game, stepping the game, and
running the game automatically.

## Building and running the app

You will need to have Node.js and Yarn installed to build and run this app.

```bash
$ yarn                         # Installs all dependencies
$ yarn build                   # Builds the app
$ yarn dev                     # Starts the server locally on http://localhost:3000
```
]
## How the game works

The game world consists of a rectangular grid of dimension `width` x `height` .
The top-left of the world is (0, 0) and the bottom-right is ( `width-1` , `height-1` ).
An object in the world can have any coordinate within this range.

There are a number of fish happily swimming around in the world, each with a different
point value and differing amounts of health. The octopus starts out in the middle of the world.

Note that objects in the game cannot collide with one another; that is, multiple fish can
occupy the same location at the same time, and the octopus and fish can move through each other
without bumping into each other.

In addition to fish, the world contains **traps**, which are areas which will kill the octopus
if it gets too close to them. A trap is defined by an `x` and `y` coordinate and a `radius` .
If the octopus goes within `radius` units of the trap, it will die, and the game is over!
(Note, however, that traps are stationary and do not move.)

The octopus has a number of tentacles, each of which can grab a single fish at a time. The
octopus can only grab fish that are within a certain distance of the octopus. If a fish is
grabbed by a tentacle, it will be held by that tentacle until it is killed or it moves out
of range of the octopus. Note that you are not responsible for managing which fish are
grabbed by tenacles; this happens automatically. All you need to do is move the octopus.

On each time step, each fish that is held by a tentacle will have `attack` units subtracted from
its health. If a fish's health drops to 0 or below, the fish is killed and the game score
increases by the fish's point value. (Note! This means that it will typically take multiple time
steps of holding a fish in order for the octopus to kill it.) Also, a fish will tend to swim
away from the octopus when it is grabbed by a tentacle, and if the fish swims out of range of the
octopus, it will be released by the tentacle and immediately restore to full health.
Therefore, there is an opportunity cost to allowing a fish that you have already grabbed to swim
away!

On each time step, the octopus may move up to `speed` distance units from its current position.
The octopus will automatically grab fish that are within `reach` distance units of itself with
its empty tentacles. The octopus will attempt to grab the closest fish first.

Your job is to write code that moves the octopus to maximize your score after 1000 time steps, 
without getting caught by any traps.

## Your Octopus code

If you look at `src/lib/Octopus.ts`, you'll see that the `Octopus` class has a method called
`nextMove()`. This method is called each time step, and it should return an object with the
`x` and `y` coordinates of the octopus's next move.

Note that if you try to move more than `this.speed` units in a single time step, the move will
fail and the octopus won't move at all. (Note that you do *not* need to worry about moving the
octopus off the edge of the world; the game will automatically prevent the octopus from going
out of bounds.)

The existing implementation is very dumb; it just moves the octopus in a random direction each
time step, like so:

```
	nextMove(): { x: number; y: number } {
		const x = this.x + (Math.random() < 0.5 ? 1 : -1) * this.speed * 0.5;
		const y = this.y + (Math.random() < 0.5 ? 1 : -1) * this.speed * 0.5;
		return { x, y };
	}
```

Your job is to write much better code that takes into account the locations of the fish and traps
in the world on each time step.

The state of the game world is reflected in the `GameWorld` object, found in `src/lib/GameWorld.ts`.
Your octopus code can use this world state to determine the best move to make.
It includes the size of the world, the number and types of fish in the world, and the locations
and sizes of traps. The octopus code can access the game world from the variable `this.world`.

For example, to enumerate all of the fish in the world, you code could do something like:

```
    for (const fish of this.world.fishes()) {
        // fish.x and fish.y are the coordinates of the fish,
        // fish.health is the health of the fish, and fish.value is the point value of the fish.
    }
```

You can similarly inspect `this.world.traps` to get the locations and sizes of the traps.

Happy farming!