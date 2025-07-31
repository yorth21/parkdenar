interface PlateProps {
	plate?: string;
}

export function Plate({ plate }: PlateProps) {
	return (
		<div className="flex justify-center">
			<div className="bg-yellow-400 border-4 border-black rounded-md px-6 py-2 inline-block shadow text-center">
				<span className="font-mono text-2xl font-bold tracking-widest text-black drop-shadow">
					{plate}
				</span>
			</div>
		</div>
	);
}
