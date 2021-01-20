<script>
    import Stat from "./Stat.svelte"
    import { Row } from "sveltestrap"

    export let stats

</script>

<h3 class='mt-3'>Success rate</h3>
<Row>
    {#await stats then stats}
        {#each Object.keys(stats) as period}
            <Stat {period} data={stats[period]}/>
        {/each}
    {/await}
</Row>
