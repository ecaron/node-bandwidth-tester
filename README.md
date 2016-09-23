# Node Bandwidth Tester

This project is a tiny NodeJS application that was designed to scratch an itch. My wife's family lives on a farm that
frequently has bad internet, and their DSL provider has had a difficult time explaining the poor service. I wanted a tiny
device that could sit on their network, measure latency & download speeds, and remotely store that data for graphing & analytic purposes.

### What I'm Using
* A Raspberry Pi Zero - $5
* An 8GB micro SD Card - $5
* A micro USB ethernet adapter - $10
* A micro USB charger cable (let's be honest, everyone has a dozen of these lying around)

So for $20 I have a tiny setup that I can plug straight into their DSL and it'll measure 24/7 the quality of service they're getting. With this I should be able to detect patterns (for example after 3 days of running this at home I was able to spot some throttling happening from my own provider...)

You wouldn't have to use a Raspberry Pi - this will work on any computer that can run Node. I just like it on the Raspberry Pi because it weeds out other variables that might otherwise skew the numbers.

## Features
* Capable of logging metrics locally and remotely
* Executes a bandwidth test that measures minimum, average and maximum speeds (by default calculated every second)
* Can be directed to measure latency against any pingable address (such as 8.8.8.8)
* Can measure download speed from any publicly accessible URL (such as any listed on https://linhost.info/2013/10/download-test-files/)
* Can have a "random" factor for when to run, to help thoroughly test at different times without clogging the pipes
* Works with NodeJS v0.10 through v6

## Environment Variables
All environment variables can either be maintained by the system, or stored in a `.env` file in the same directory as the `client.js` file.
### Required
* `PING_REMOTE` - This is the server that should be pinged to measure latency. I use `8.8.8.8`
* `TARGET_FILE` - This is the URL of the large file to be downloaded. I find a 10 meg file to be great ([a couple great options are listed here](http://www.thinkbroadband.com/download.html))
* `MACHINE_NAME` - The name of the machine running the bandwidth test (useful if you have multiple devices reporting to a remote server)

### Optional
* `ODDS_OF_RUNNING` - A number, 0 through 1, that represents the percent of time the application should run. For example 0.2 would run the script 20% of the attempts, and 1 would run the application every time (the default behavior)
* `LOCAL_HISTORY` - Full path to a writable file where a JSON file will be created that stores the metrics of each run
* `REMOTE_SERVER` - URL where the server will send a POST that contains `machine`, `datetime`, and a JSON stringified value of the results called `data`
* `REMOTE_API_KEY` - A loose security measure where an addition API-KEY is sent in the HTTP header to limit data logging

## Running the application

After you have the environment variables defined,

1. Run `npm install` to grab the few required packages
2. Run `node client` and the test will be executed.

I have `node client` setup in crontab to run every 10 minutes, with an `ODDS_OF_RUNNING` of 0.5, which means I'm actually only calculating my speed 3 times per hour. But this does equate to 720 megs a day and 21 gigs a month if you're downloading a 10 meg file, so plan accordingly.

## Sample Bandwidth Chart
![Bandwidth Chart](remote-host-example/bandwidth-chart.png?raw=true "Bandwidth Chart")

## Sample Latency Chart
![Latency Chart](remote-host-example/latency-chart.png?raw=true "Latency Chart")
