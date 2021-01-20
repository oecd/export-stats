<script>
    import { onDestroy, onMount } from 'svelte';
    import SvelteHeatmap from '@jfix/svelte-heatmap'

    export let data
    let heatmap, startDate, endDate, target

    const convertData = (arr) => arr.map((item) => {
        // convert Date string to Date object
        return {...item, date: new Date(item.date)}
    })
    $: {
        data && (
            startDate = data[0].date, 
            // don't trust the data, because it is not complete for the current year
            endDate = new Date((new Date(startDate)).getFullYear(), 11, 31)
        )
        data && target && (
            heatmap = new SvelteHeatmap({
                props: {
                    data: convertData(data),
                    allowOverflow: true,
                    monthGap: 20,
                    monthLabelHeight: 25,
                    fontColor: '#888888',
                    fontSize: '16',
                    emptyColor: '#333333',
                    view: 'monthly',
                    monthLabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    colors: ['#e74c3c', '#00bc8c'],
                    startDate,
                    endDate,
                    monthLayout: '3x4',
                },
                target
            })
        )
    }
    //   const colorFail = '#E43F6F' // 'paradise pink'
    //   const colorWin = '#95A78D' // 'spanish gray'
    //   const colorNoExport = '#D9D9D9' // 'gainsboro'
    //   const colorNeutral = '#C9C5CB' // 'lavender gray'
</script>

<div class="tab-content">
    <div class="tab-pane fade show active" role="tabpanel">
        <div id="heatmap" bind:this={target}></div>
    </div>
</div>
