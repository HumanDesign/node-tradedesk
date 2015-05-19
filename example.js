var Tradedesk = require('./lib/tradedesk');
var client = Tradedesk({
                      login: 'test',
                      password: 'swordfish'
                      });

client.get('/supplyvendor/query/facets', function(error, x ,res) {
  if (error) throw error;
  console.log(x);
  console.log(res);
});
