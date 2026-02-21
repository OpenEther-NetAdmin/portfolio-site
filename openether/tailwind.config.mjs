/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Brand colors
				primary: '#22c55e',      // Neon Green
				primaryHover: '#4ade80',  // Neon Green light
				background: '#020617',   // Deep Space (Slate 950)
				surface: '#0f172a',      // Slate 900
				border: '#1e293b',       // Slate 800
				text: '#f1f5f9',         // Slate 100
				textMuted: '#94a3b8',    // Slate 400
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Outfit', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
