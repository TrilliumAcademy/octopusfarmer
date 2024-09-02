'use client';
import { useState, useEffect } from 'react';
import React from 'react';
import { GameWorld, GameType } from '@/lib/GameWorld';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorldView } from '@/components/worldview';
import { PauseIcon, PlayIcon, StepForwardIcon, RotateCcwIcon } from 'lucide-react';
import { on } from 'events';

function DifficultySelect({
	difficulty,
	setDifficulty,
}: {
	difficulty: GameType;
	setDifficulty: (difficulty: GameType) => void;
}) {
	return (
		<Select value={difficulty} onValueChange={setDifficulty}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Difficulty" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="test">Test (very easy)</SelectItem>
				<SelectItem value="easy">Easy</SelectItem>
				<SelectItem value="normal">Normal</SelectItem>
				<SelectItem value="hard">Hard</SelectItem>
				<SelectItem value="insane">Insane</SelectItem>
			</SelectContent>
		</Select>
	);
}

function NewGame({ setGame }: { setGame: (game: GameWorld) => void }) {
	const [difficulty, setDifficulty] = useState<GameType>('normal');

	return (
		<div className="flex flex-row gap-2">
			<Button onClick={() => setGame(new GameWorld(difficulty))}>Start new game</Button>
			<DifficultySelect difficulty={difficulty} setDifficulty={setDifficulty} />
		</div>
	);
}

function ShowGame({ game, onRestart }: { game: GameWorld; onRestart: () => void }) {
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	const [timer, setTimer] = useState(0);

	const onStep = () => {
		game.update();
		setTimer((prevTimer: number) => prevTimer + 1);
	};

	const runClicked = () => {
		if (intervalId !== null) {
			clearInterval(intervalId);
			setIntervalId(null);
			return;
		}
		const timeout = setInterval(() => {
			onStep();
		}, 20);
		setIntervalId(timeout);
	};

	const restartClicked = () => {
		onRestart();
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-row gap-4 items-center">
				<Button onClick={runClicked}>
					{intervalId !== null ? <PauseIcon /> : <PlayIcon />}
					{intervalId !== null ? 'Pause' : 'Play'}
				</Button>
				<Button disabled={intervalId != null} onClick={onStep}>
					<StepForwardIcon />
					Step
				</Button>
				<Button onClick={restartClicked}>
					<RotateCcwIcon />
					Restart
				</Button>
				<div>Moves: {game.moves}</div>
				<div>Score: {game.score}</div>
			</div>
			<div className="flex flex-row gap-4 p-4 justify-center">
				<WorldView game={game} />
			</div>
		</div>
	);
}

export function GameDetail() {
	const [game, setGame] = useState<GameWorld | null>(null);

	// useEffect(() => {
	// 	const intervalId = setInterval(() => {
	// 		setTimer((prevTimer: number) => prevTimer + 1); // Increment the timer
	// 	}, 200);

	// 	const fetchGame = async () => {
	// 		const res = await fetch(`/api/game/${params.game}`, {
	// 			method: 'GET',
	// 		});
	// 		if (!res.ok) {
	// 			return;
	// 		}
	// 		const data = await res.json();
	// 		setGame(data);
	// 	};
	// 	fetchGame();
	// 	return () => clearInterval(intervalId);
	// }, [timer, params.game]);

	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="flex flex-row gap-2">
				{game ? <ShowGame game={game} onRestart={() => setGame(null)} /> : <NewGame setGame={setGame} />}
			</div>
		</div>
	);

	// return (
	// 	game && (
	// 		<div className="flex flex-row gap-4 justify-start">
	// 			<div className="w-160 flex flex-col gap-1 p-4 justify-start">
	// 				<div className="font-mono font-sm">Viewing game:</div>
	// 				<div className="font-mono font-sm">{params.game}</div>
	// 				<div className="font-mono font-sm pt-6">Hash: {stringHash(params.game).toString(16)}</div>
	// 				<div className="font-mono font-sm pt-6">Moves: {game!.world.moves}</div>
	// 				<div className="font-mono font-sm">Score: {game!.world.score}</div>
	// 				<div className="font-mono font-sm">Octopus is {game!.world.octopus.alive ? 'alive' : 'dead'}</div>
	// 			</div>
	// 			<div className="flex flex-row gap-4 p-4 justify-center">
	// 				<WorldView world={game.world} />
	// 			</div>
	// 		</div>
	// 	)
	// );
}
