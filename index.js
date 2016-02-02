// Requiring the HTTP module, and storing the exports object
// which it returns in a variable of the same name
var http = require("http");

// Creating a new server, with a callback function that will be
// called everytime a request is received by the server
var myServer = http.createServer(function(req, res){
  // Adding the content type to the response header
  res.writeHead(200, {"Content-Type" : "text/html"});

  // Writing some HTML to the response body
  res.write("<h1>Testing my Server</h1><br>You sent a request for " + req.url);

  // Sending the response back to the client
  res.end();
});

// Setting up a listener on port 3000, to listen for requests.
// Using the callback function to notify me once the server
// has been setup
myServer.listen(3000, function(){
  console.log("My Server is now listening on port 3000");
});
