<script>
    import { Card, CardHeader, CardBody, Row, Col } from "sveltestrap"
    import Heatmap from "./Heatmap.svelte"
    import Tabs from "./Tabs.svelte"
    export let heatmaps, loadHeatmap
    let tabs, activeTab, data

    $: tabs = Object.keys(heatmaps).reverse()
    $: data = heatmaps[Object.keys(heatmaps).reverse()[0]]
    $: loadHeatmap = (year, index) => {
        console.log(`Click: ${index} ${year}`)
    }

    const tabClicked = (e) => {
        activeTab = e.detail.i
        data = heatmaps[Object.keys(heatmaps).reverse()[e.detail.i]]
        document.querySelector('#heatmap').innerHTML = ''
    }
</script>

<h3 style='margin-top: 1em'>History</h3>
<Row>
    <Col>
        <Card style="background-color: #222222; border: 1px solid #444444; border-radius: 0.25rem;">
            <CardHeader>
                <Tabs {activeTab} {tabs} on:tabClicked={tabClicked}/>
            </CardHeader>
            <CardBody>
                <Heatmap {data}/>
            </CardBody>
        </Card>
    </Col>
</Row>
