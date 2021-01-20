<script>
	import { onMount } from "svelte"
	import { Container, Row, Col, Navbar, NavbarBrand } from "sveltestrap"
	import Heatmaps from "./Heatmaps.svelte"
	import Meme from "./Meme.svelte"
	import Placeholder from './Placeholder.svelte';
	import Stats from "./Stats.svelte"
	let url = './spinner.svg', stats = {}, heatmaps = {}, loading = true

  	onMount(async () => {
		const res = await fetch(`https://slack-export-updater-2.jfix1.repl.co/aio`);
		// const res = await fetch('./test-data.json')
		const statsResults = await res.json()
		stats = await statsResults.stats
		url = await statsResults.meme.url
		heatmaps = await statsResults.heatmap
		loading = false
	  });
	  
	  $: console.log(`Loading status: ${loading}`)
</script>

<Navbar class="navbar navbar-expand-lg navbar-dark bg-dark">
	<NavbarBrand>
		<img src="/oecd-logo.png" width="30" height="30" alt="OECD logo">
		Export statistics
	</NavbarBrand>
</Navbar>

<Container class="mt-5">
	<main>
		{#if loading}
			<Placeholder/>
		{:else}
		<Stats {stats}/>
		<Row>
			<Col xs=12 md=12 lg=6>
				<Heatmaps {heatmaps}/>	
			</Col>
			<Col xs=12 md=12 lg=6>
				<Meme url={url}/>
			</Col>
		</Row>
		{/if}
	</main>	
</Container>
