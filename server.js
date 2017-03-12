let express = require('express');
let server = express();

server.use(express.static('static'));
 
server.get('/notes', function(req, res) {
  res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
});
 
server.listen(3000);