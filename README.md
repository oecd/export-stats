# Export stats

The stats page is built using Svelte.  To deploy a new version: Whenever a commit is pushed to the `main` branch, a GitHub Action is triggered which will build the page and then deploy the result to the `gh-pages` branch. Have a look at the `.github/workflows/publish.yml` file. As usual, the page is visible here: https://oecd.github.io/export-stats/.

One API endpoint delivers stats to keep track of one percentage: _successful exports_.

* https://slack-export-updater-2.jfix1.repl.co/aio returns a JSON object for `stats`, `heatmap` and `meme` info ✅
* Amazon lambda function to post daily reminder into Slack channel ✅
* pretty up the page here: https://oecd.github.io/export-stats/ ✅
* rewrite the page in some kind of more modern framework ✅
* Monday as the first day of week in heatmap
* tooltips on heatmap
* revert official heatmap copmonent (rather than my own)
* add more information

## How to deploy the Lambda function

Just in the probable case I forget when I next need to deploy, here's a quick reminder how to deploy the lambda function:

    $ sls deploy function --function nudger
    Serverless: Packaging function: nudger...
    Serverless: Excluding development dependencies...
    Serverless: Uploading function: nudger (3.09 MB)...
    Serverless: Successfully deployed function: nudger
    ✔ ~/Projects/export-stats/lambda [master ↑·1|…1]

If you need to make a configuration change (like move from Summertime to Wintertime), you need to deploy all artifacts, not just the function:

    $ sls deploy 
    Serverless: Packaging service...
    Serverless: Excluding development dependencies...
    Serverless: Uploading CloudFormation file to S3...
    Serverless: Uploading artifacts...
    Serverless: Uploading service export-nudger.zip file to S3 (38.2 MB)...
    Serverless: Validating template...
    Serverless: Updating Stack...
    Serverless: Checking Stack update progress...
    ...........
    Serverless: Stack update finished...
    Service Information
    service: export-nudger
    stage: dev
    region: eu-central-1
    stack: export-nudger-dev
    resources: 7
    api keys:
      None
    endpoints:
      None
    functions:
      nudger: export-nudger-dev-nudger
    layers:
      None
    Serverless: Removing old service artifacts from S3...
    Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.
