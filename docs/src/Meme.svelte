<script>
    import { Row, Col, Card, CardBody, CardHeader } from 'sveltestrap'
    export let url
</script>

<h3 style='margin-top: 1em'>Streak</h3>

<Row class='mt-1'>
    <Col>
        <Card>
            <img class='card-img' alt='Meme' src='{url}'/>
            <!-- <CardHeader>Streak</CardHeader> -->
        </Card>
    </Col>
</Row>
