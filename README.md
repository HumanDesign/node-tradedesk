#node-tradedesk
---
## Description
node-tradedesk is a node.js module for interacting with The Trade Desk's API. View the API's documentation at [https://apis.thetradedesk.com/v3/doc](https://apisb.thetradedesk.com/v3/doc)

## Example
```javascript
var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk({token: 'thetoken'});

client.get('adgroup/query/facets', function(error, x, res) {
  if (error) throw error;
  console.log(x);
});
```
