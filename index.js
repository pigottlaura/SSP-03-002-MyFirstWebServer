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

  // Getting the filetype of the resource by splitting the
  // url at the "." and then taking the second half of this
  // string
  var typeOfResource = requestedResource.split(".")[1];
  console.log(typeOfResource);

  // Creating a variable to store the status code and content
  // type for the response header (so I can change it depending on
  // if I could locate the resource or not, and what type of resource
  // it is).
  var statusCode = 200;
  var contentType = "text/html";

  // If the requestedResource is the homepage
  if(requestedResource == "/index.html")
  {
    resource = fs.readFileSync("./html" + requestedResource);
    res.write(resource);
  }
  else {
    statusCode = 404;

    // Writing some HTML to the response body
    res.write("<h1>Sorry :(</h1>We couldn't find what you were looking for.<br>You sent a request for " + requestedResource);
  }

  if(typeOfResource == "png" || typeOfResource == "jpg")
  {
    console.log("HIIIIIIIIIIIIIIII");
  }

  // Adding the content type to the response header
  res.writeHead(statusCode, {"Content-Type" : contentType});

  // Sending the response back to the client
  res.end();
});

// Setting up a listener on port 3000, to listen for requests.
// Using the callback function to notify me once the server
// has been setup
myServer.listen(3000, function(){
  console.log("My Server is now listening on port 3000");
});
