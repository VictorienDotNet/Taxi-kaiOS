import React, { useEffect } from "react";
import css from "./Call.module.scss";

export function Graphic(props) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
			<path
				d="M 0 16 C 0 7.163 7.163 0 16 0 L 48 0 C 56.837 0 64 7.163 64 16 L 64 48 C 64 56.837 56.837 64 48 64 L 16 64 C 7.163 64 0 56.837 0 48 Z"
				fill="rgb(0, 194, 74)"
			></path>
			<path
				d="M 49.3 30.1 C 48.833 30.1 48.442 29.958 48.125 29.675 C 47.808 29.392 47.617 29 47.55 28.5 C 47.117 25.133 45.692 22.25 43.275 19.85 C 40.858 17.45 37.983 16 34.65 15.5 C 34.15 15.5 33.758 15.317 33.475 14.95 C 33.192 14.583 33.05 14.167 33.05 13.7 C 33.05 13.2 33.225 12.792 33.575 12.475 C 33.925 12.158 34.333 12.033 34.8 12.1 C 39 12.633 42.608 14.425 45.625 17.475 C 48.642 20.525 50.45 24.15 51.05 28.35 C 51.083 28.817 50.933 29.225 50.6 29.575 C 50.267 29.925 49.833 30.1 49.3 30.1 Z"
				fill="rgb(255, 255, 255)"
			></path>
			<path
				d="M 40.1 30.1 C 39.767 30.1 39.425 29.967 39.075 29.7 C 38.725 29.433 38.483 29.1 38.35 28.7 C 38.05 27.833 37.542 27.033 36.825 26.3 C 36.108 25.567 35.317 25.05 34.45 24.75 C 34.017 24.583 33.675 24.35 33.425 24.05 C 33.175 23.75 33.05 23.4 33.05 23 C 33.05 22.4 33.25 21.942 33.65 21.625 C 34.05 21.308 34.5 21.217 35 21.35 C 36.6 21.85 38.008 22.692 39.225 23.875 C 40.442 25.058 41.3 26.467 41.8 28.1 C 41.933 28.567 41.825 29.017 41.475 29.45 C 41.125 29.883 40.667 30.1 40.1 30.1 Z"
				fill="rgb(255, 255, 255)"
			></path>
			<path
				d="M 47.35 50.95 C 43.217 50.95 39.075 49.925 34.925 47.875 C 30.775 45.825 27.067 43.167 23.8 39.9 C 20.533 36.633 17.883 32.917 15.85 28.75 C 13.817 24.583 12.8 20.45 12.8 16.35 C 12.8 15.417 13.125 14.608 13.775 13.925 C 14.425 13.242 15.25 12.9 16.25 12.9 L 22.9 12.9 C 23.967 12.9 24.842 13.167 25.525 13.7 C 26.208 14.233 26.65 15.017 26.85 16.05 L 28.1 21.35 C 28.233 22.283 28.208 23.075 28.025 23.725 C 27.842 24.375 27.483 24.933 26.95 25.4 L 21.8 30.1 C 23.467 32.733 25.283 35.008 27.25 36.925 C 29.217 38.842 31.383 40.483 33.75 41.85 L 38.75 36.9 C 39.317 36.3 39.95 35.883 40.65 35.65 C 41.35 35.417 42.133 35.4 43 35.6 L 47.7 36.75 C 48.733 37.017 49.517 37.492 50.05 38.175 C 50.583 38.858 50.85 39.7 50.85 40.7 L 50.85 47.45 C 50.85 48.45 50.508 49.283 49.825 49.95 C 49.142 50.617 48.317 50.95 47.35 50.95 Z"
				fill="rgb(255, 255, 255)"
			></path>
		</svg>
	);
}