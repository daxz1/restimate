# restimate

Estimates of R.

A React application and an api for presenting graphs of estimated R values, based on case data from Her Majesty's Government.

Data comes from https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json

## Method

1. Days with no data are assumed to have zero cases
2. Case data is smoothed with a 7 day rolling average
3. R is estimated from a day's 7 day case rolling average compared to the rolling average from 5 days previously, where 5 days appears to be the incubation period for the virus

## Calculations

All the important code is in `api/src/covid.ts`.

## Building for development

One terminal in `api` and one in `app`.

In each do:

    npm i
    npm run build
    npm start

Once it is all running you should be launched into your react dev server as usual.

## Building for deployment

    docker build .

## Contact

[Doug Winter](mailto:doug@winter.cx)

