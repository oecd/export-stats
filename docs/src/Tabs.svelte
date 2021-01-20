<script>
    import { createEventDispatcher } from "svelte"
    import { Nav, NavItem, NavLink } from "sveltestrap"

    export let activeTab = 0, tabs
    const dispatch = createEventDispatcher()
</script>

<Nav tabs class="card-header-tabs">
    {#await tabs then tabs}
        {#each tabs as year, i}
        <NavItem>
            <NavLink 
                on:click={() => dispatch('tabClicked', {year, i})} 
                class={i === activeTab ? 'active' : ''}>
                {year}
            </NavLink>
        </NavItem>
        {/each}
    {/await}
</Nav>
