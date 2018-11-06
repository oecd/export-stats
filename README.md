# Export stats

A hodgepodge of distributed functions to keep track of one percentage: _successful exports_.

* https://runkit.com/jfix/export-stats-get to retrieve two values: the number of `total` exports and the number of `success` ✅
* https://runkit.com/jfix/export-stats-updater to update the database every day ✅
* Amazon lambda function to post daily reminder into Slack channel ✅
* pretty up the page here: https://jfix.github.io/export-stats/ ✅

## How to deploy the Lambda function

Just in the probable case I forget when I next need to deploy, here's a quick reminder how to deploy the lambda function:

    22:24 $ sls deploy function --function nudger
    Serverless: Packaging function: nudger...
    Serverless: Excluding development dependencies...
    Serverless: Uploading function: nudger (3.09 MB)...
    Serverless: Successfully deployed function: nudger

Easy-peasy, just need to remember it ...
