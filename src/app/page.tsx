/* Octopus Farmer */

"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash } from "@phosphor-icons/react";
import DeleteGameDialog from "@/components/deletegame";
import { Button } from "@/components/ui/button";


function GameList() {
	const [games, setGames] = useState([]);

	useEffect(() => {
		async function fetchGames() {
			const res = await fetch("/api/games", {
				method: "GET",
			}).catch((err) => {
				throw err;
			});
			const data = await res.json();
			setGames(data);
		}
		fetchGames();
	}, []);

	return (
		<div className="flex flex-col w-full gap-2">
			{games.map((game, i) => (
				<div className="flex flex-row justify-center gap-4" key={i}>
					<Link className="flex flex-row" href={`/game/${game.userId}/${game.gameId}`}>
						<div>{game.userId}</div>
						<div>{game.gameId}</div>
					</Link>
					<div>
						<DeleteGameDialog className="bg-slate-500" userId={game.userId} gameId={game.gameId} >
							<Trash size={16} className="text-red-500" />
						</DeleteGameDialog>
					</div>
				</div>
			))}
		</div>
	);
}

export default function Home() {
	const newGame = async () => {
		const res = await fetch("/api/games/testuser", {
			method: "POST",
		}).catch((err) => {
			throw err;
		});
		const data = await res.json();
		window.location.href = `/game/testuser/${data.gameId}`;
	};



	return (
		<div className="flex flex-col font-mono p-8">
			<Button className="rounded-full border-2 border-red-700 bg-black text-white hover:bg-slate-600" onClick={newGame}>
				New game
			</Button>
			<GameList />
		</div>
	);
}
