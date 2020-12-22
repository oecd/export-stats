# Export stats

One API endpoint delivers stats to keep track of one percentage: _successful exports_.

* https://slack-export-updater.jfix1.repl.co/aio returns a JSON object for `stats`, `heatmap` and `meme` info ✅
* Amazon lambda function to post daily reminder into Slack channel ✅
* pretty up the page here: https://oecd.github.io/export-stats/ ✅
* rewrite the page in some kind of more modern framework

## How to deploy the Lambda function

Just in the probable case I forget when I next need to deploy, here's a quick reminder how to deploy the lambda function:

    22:24 $ sls deploy function --function nudger
    Serverless: Packaging function: nudger...
    Serverless: Excluding development dependencies...
    Serverless: Uploading function: nudger (3.09 MB)...
    Serverless: Successfully deployed function: nudger
    ✔ ~/Projects/export-stats/lambda [master ↑·1|…1]


Humbly acknowledging use of https://github.com/DKirwan/calendar-heatmap. Thank you!
