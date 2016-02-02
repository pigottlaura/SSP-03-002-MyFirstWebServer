// Requiring the HTTP module, and storing the exports object
// which it returns in a variable of the same name
var http = require("http");

// Requiring the File System module, and storing the exports object
// which it returns in a variable of the same name
var fs = require("fs");

var resource;

// Reading in the html directory
fs.readdir("./html", function(err, data){
  // Logging out the details of errors (if any)
  if(err){
    console.log(err);
  }

  // Looping through each resource in the directory
  for(d in data){
    // Logging out the name of each file in the directory
    console.log(data[d]);
  }
});

// Creating a new server, with a callback function that will be
// called everytime a request is received by the server
var myServer = http.createServer(function(req, res){
  // Using a ternary operator to set the default page to index.html,
  // if the requested url was "/", otherwise the requested requestedResource
  // is equal to whatever url was entered
  var requestedResource = req.url == "/" ? "/index.html" : req.url;

  // If the requestedResource is the homepage
  if(requestedResource == "/index.html")
  {
    resource = fs.readFileSync("./html" + requestedResource);

    // Adding the content type to the response header
    res.writeHead(200, {"Content-Type" : "text/html"});
    res.write(resource);
  }
  else {
    // Adding the content type to the response header
    res.writeHead(404, {"Content-Type" : "text/html"});

    // Writing some HTML to the response body
    res.write("<h1>Sorry :(</h1>We couldn't find what you were looking for.<br>You sent a request for " + requestedResource);
  }

  // Sending the response back to the client
  res.end();
});

// Setting up a listener on port 3000, to listen for requests.
// Using the callback function to notify me once the server
// has been setup
myServer.listen(3000, function(){
  console.log("My Server is now listening on port 3000");
});
