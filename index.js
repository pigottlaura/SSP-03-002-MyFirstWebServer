// Requiring the HTTP module, and storing the exports object
// which it returns in a variable of the same name
var http = require("http");

// Requiring the File System module, and storing the exports object
// which it returns in a variable of the same name
var fs = require("fs");

var resourceContent;

// Reading in the html directory
fs.readdir("./html", function(err, data){
  // Logging out the details of errors (if any)
  if(err){
    console.log(err);
  }

  // Looping through each resource in the directory
  for(d in data){
    // Logging out the name of each file in the directory
    //console.log(data[d]);
  }
});

// Creating a new server, with a callback function that will be
// called everytime a request is received by the server
var myServer = http.createServer(function(req, res){
  // Using a ternary operator to set the default page to index.html,
  // if the requested url was "/", otherwise the requested requestedResource
  // is equal to whatever url was entered
  var requestedResource = req.url == "/" ? "/index.html" : req.url;
  console.log("Recieved request for " + requestedResource);

  // Getting the filetype of the resource by finding the index of the last full stop in the
  // requesting URL, and then using this to create a substring of everything that comes
  // after this i.e. the filetype
  var lastFullstop = requestedResource.lastIndexOf(".");
  var typeOfResource = requestedResource.substr(lastFullstop + 1, requestedResource.length);

  // Creating a variable to store the status code and content
  // type for the response header (so I can change it depending on
  // if I could locate the resource or not, and what type of resource
  // it is).
  var statusCode;
  var contentType;

  // Reading in the contents of the resource the user has requested,
  // which should be in the html folder of my current directory
  resourceContent = fs.readFileSync("./html" + requestedResource);

  // Checking what type of resource the request was for
  if(typeOfResource == "html" || typeOfResource == "css" || typeOfResource == "js")
  {
    contentType = "text/" + typeOfResource;
  }else if(typeOfResource == "png" || typeOfResource == "jpg")
  {
    contentType = "image/" + typeOfResource;
  }else if(typeOfResource == "woff")
  {
    contentType = "font/" + typeOfResource;
  }

  // Checking if there is content in the resource variable
  if(resourceContent.length > 1)
  {
    statusCode = 200;
  }else {
    statusCode = 404;
    resourceContent = "<h1>Sorry :(</h1>We couldn't find what you were looking for.<br>You sent a request for " + requestedResource;
  }

  // Adding the content type to the response header
  res.writeHead(statusCode, {"Content-Type" : contentType});

  // Writing the resource to the body of the response
  res.write(resourceContent);

  // Sending the response back to the client
  res.end();

  console.log("Responded to request for" + requestedResource);
});

// Setting up a listener on port 3000, to listen for requests.
// Using the callback function to notify me once the server
// has been setup
myServer.listen(3000, function(){
  console.log("My Server is now listening on port 3000");
});
