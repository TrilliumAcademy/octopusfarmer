/* Octopus Farmer */

'use client';

import { GameDetail } from "@/components/gamedetail";

function About() {
	return (
		<div className="w-3/5 font-mono text-sm text-slate-400">
			Octopus Farmer is a game in which you control an octopus that roams around a world, catching fish with its
			tentacles. The game is played by writing a program that controls the octopus via a REST API. See{' '}
			<span className="underline">
				<a href="https://github.com/mdwelsh/octopusfarmer">the GitHub page</a>
			</span>{' '}
			for more details and documentation.
		</div>
	);
}

export default function Home() {
	return (
		<div className="flex flex-col font-mono p-8 gap-4">
			<About />
			<GameDetail />
		</div>
	);
}
