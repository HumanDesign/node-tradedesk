#node-tradedesk
---
## Description
node-tradedesk is a node.js module for interacting with The Trade Desk's API.

## Example
```javascript
var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk({token: 'thetoken'});

client.get('adgroup/query/facets', function(error, x, res) {
  if (error) throw error;
  console.log(x);
});
```
