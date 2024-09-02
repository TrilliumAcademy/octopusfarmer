import { useEffect, useRef } from 'react';

import { GameWorld } from '@/lib/GameWorld';
import { Fish } from '@/lib/Fish';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

function drawWorld(ctx: CanvasRenderingContext2D, world?: GameWorld) {
	if (!world) {
		return;
	}
	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	const tileWidth = CANVAS_WIDTH / world.width;
	const tileHeight = CANVAS_HEIGHT / world.height;
	ctx.lineWidth = 1;
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// Draw traps first.
	if ('traps' in world) {
		for (const trap of world.traps) {
			ctx.beginPath();
			ctx.arc(trap.x * tileWidth, trap.y * tileHeight, trap.radius * tileWidth, 0, 2 * Math.PI, false);
			ctx.fillStyle = '#602020';
			ctx.fill();
		}
	}
	// Draw the octopus.
	ctx.font = '40px sans-serif';
	ctx.fillText('🐙', world.octopus.x * tileWidth, world.octopus.y * tileHeight);
	if (!world.octopus.alive) {
		ctx.fillText('❌', world.octopus.x * tileWidth, world.octopus.y * tileHeight);
	}
	// Draw all fish.
	ctx.font = '14px sans-serif';
	for (const fish of world.fishes()) {
		// If the fish is in the octopus.tentacles, draw it red.
		if (world.octopus.tentacles.some((tentacle: Fish | null) => tentacle && tentacle.id === fish.id)) {
			ctx.fillText('🎣', fish.x * tileWidth, fish.y * tileHeight);
		} else {
			const fishGlyphs = [ '🐟', '🐠', '🦈', '🐡', '🐋', '🐳', '🦐', '🐬', '🦞' ]
			// Pick the glyph based on fish.value.
			const glyph = fishGlyphs[fish.group.value % fishGlyphs.length];
			ctx.fillText(glyph, fish.x * tileWidth, fish.y * tileHeight);
		}
	}
}

export function WorldView({ game }: { game: GameWorld }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current.getContext('2d');
			if (!ctx) {
				return;
			}
			drawWorld(ctx, game);
		}
	}, [game, game.moves]);

	return (
		<div>
			<canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: '2px solid #505050' }} />
		</div>
	);
}
