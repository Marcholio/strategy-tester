# strategy-tester

Investment strategy tester for better long-term results!

## Motivation

There are plenty of investment strategy testers available, but they are usually lacking some crucial factors that affect the results dramatically. Also they are mostly focusing on short-timeframe trading, rather than long-term investing.

Therefore the question remains:

> Can technical analysis help long-term investors to make better decisions compared to plain and simple dollar cost averaging?

This tool aims to help investors evaluate their thinking, and possibly improve their results as well.

## Setting up dev environment

1. Get alphavantage api key: https://www.alphavantage.co/
2. Create `.env` file and add api key there. See template.
3. Install dependencies: `yarn`
4. Load data: `yarn get-data <ticker>`
5. `yarn start`
6. The UI should open in http://localhost:3000/strategy-tester

## Disclaimers

The tool should be considered purely educational. It's not investment advice. Contact a professional financial advisor before making any investment decisions.

## License

MIT license

Copyright (c) 2021 Markus Tyrkkö

See [LICENSE](LICENSE) for further details.
