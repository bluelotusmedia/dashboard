"use client"; // This indicates it's a Client Component
import { useState, useEffect } from "react";

export default function Home() {
	const [data, setData] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const res = await fetch("https://jsonplaceholder.typicode.com/users");
			const data = await res.json();
			setData(data);
		}

		fetchData(); // Call the async function inside useEffect
	}, []); // Empty dependency array ensures it runs only once after initial render

	return (
		<div>
			<h1>Dummy Data</h1>
			<ul>
				{data.map((item) => (
					<li key={item.id}>
						{item.name} - {item.email}
					</li>
				))}
			</ul>
		</div>
	);
}
