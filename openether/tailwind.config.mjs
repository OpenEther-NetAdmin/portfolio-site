/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Brand colors
				primary: '#06b6d4',      // Cyan
				primaryHover: '#22d3ee',  // Cyan light
				background: '#0f172a',   // Dark slate
				surface: '#1e293b',      // Slate 900
				border: '#334155',       // Slate 800
				text: '#f1f5f9',         // Slate 100
				textMuted: '#94a3b8',    // Slate 400
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				heading: ['Outfit', 'sans-serif'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
