<script>
    import { Col, Card } from "sveltestrap"
    export let period, data
    let percentage, total, success

    const statColor = (val) => val >= 95 ? 'success' : val >= 90 ? 'warning' : 'danger'
    const header = (val) => {
        switch (val) {
            case 'allTime':
                return 'All time'
            case 'thirty':
                return 'Last 30 days'
            case 'hundred':
                return 'Last 100 days'
            case 'currentYear':
                return 'This year'
            default:
                break;
        }
    }
    const calcPercentage = (stats, period) => {
        switch (period) {
            case 'currentYear':
                total = stats.currentYearTotal
                success = stats.currentYearSuccess
                break;
            default:
                total = stats.overallTotal
                success = stats.overallSuccess
                break;
        }
        percentage = Math.round(success * 100/total)
    }

    $: {
        // period && console.log(`Done!`)
        period && calcPercentage(data, period)
    }
    $: !period && console.log(`Loading ...`)
</script>

<Col xs="12" md="6" lg="3" class="mb-4">
    <Card class="text-white bg-{statColor(percentage)}">
        <div class="card-header">{header(period)}</div>
        <div class="card-body">
            <h4 class="card-title text-center percentage-header">{percentage}%</h4>
          <p class="text-right card-text">{success} exports out of {total}</p>
        </div>
    </Card>
</Col>

<style>
    .percentage-header {
        font-size: 400%;
        font-weight: bold;
    }
</style>