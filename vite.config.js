import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit(),
	],

	server: {
		host: 'localhost.tbta.bible',
		port: 8788,
	},
})
