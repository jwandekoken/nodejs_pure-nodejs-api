/*
 * Frontend Logic for application
 *
 */

const app = {};

// AJAX Client (for RESTful API)
app.client = {};

// Config
app.config = {
  sessionToken: false,
};

// Interface for making API calls
// params: headers, path, method, queryStringObject, payload, cb
app.client.request = function (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  callback
) {
  // Set defaults
  headers = typeof headers == "object" && headers !== null ? headers : {};
  path = typeof path == "string" ? path : "/";
  method =
    typeof method == "string" &&
    ["POST", "GET", "PUT", "DELETE"].indexOf(method.toUpperCase()) > -1
      ? method.toUpperCase()
      : "GET";
  queryStringObject =
    typeof queryStringObject == "object" && queryStringObject !== null
      ? queryStringObject
      : {};
  payload = typeof payload == "object" && payload !== null ? payload : {};
  callback = typeof callback == "function" ? callback : false;

  // For each query string parameter sent, add it to the path
  var requestUrl = path + "?";
  var counter = 0;
  for (var queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      counter++;
      // If at least one query string parameter has already been added, preprend new ones with an ampersand
      if (counter > 1) {
        requestUrl += "&";
      }
      // Add the key and value
      requestUrl += queryKey + "=" + queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  var xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for (var headerKey in headers) {
    if (headers.hasOwnProperty(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  // If there is a current session token set, add that as a header
  if (app.config.sessionToken) {
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      var statusCode = xhr.status;
      var responseReturned = xhr.responseText;

      // Callback if requested
      if (callback) {
        try {
          var parsedResponse = JSON.parse(responseReturned);
          callback(statusCode, parsedResponse);
        } catch (e) {
          callback(statusCode, false);
        }
      }
    }
  };

  // Send the payload as JSON
  var payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
};

// Bind the forms
app.bindForms = function () {
  if (document.querySelector("form")) {
    var allForms = document.querySelectorAll("form");
    for (var i = 0; i < allForms.length; i++) {
      allForms[i].addEventListener("submit", function (e) {
        // Stop it from submitting
        e.preventDefault();
        var formId = this.id;
        var path = this.action;
        var method = this.method.toUpperCase();

        // Turn the inputs into a payload
        var payload = {};
        var elements = this.elements;

        for (var i = 0; i < elements.length; i++) {
          if (elements[i].type !== "submit") {
            let nameOfElement = elements[i].id;
            let valueOfElement = elements[i].value;
            payload[nameOfElement] = valueOfElement;
          }
        }

        // If the method is DELETE, the payload should be a queryStringObject instead
        var queryStringObject = method == "DELETE" ? payload : {};

        // Call the API
        // params: headers, path, method, queryStringObject, payload, cb
        app.client.request(
          undefined,
          path,
          method,
          queryStringObject,
          payload,
          function (statusCode, responsePayload) {
            // Display an error on the form if needed
            if (statusCode !== 200) {
              if (statusCode == 403) {
                // log the user out
                app.logUserOut();
              } else {
                // Try to get the error from the api, or set a default error message
                var error =
                  typeof responsePayload.Error == "string"
                    ? responsePayload.Error
                    : "An error has occured, please try again";

                window.alert(error);
              }
            } else {
              let successMsg = responsePayload ? responsePayload : "Sucess!";
              window.alert(successMsg);
            }
          }
        );
      });
    }
  }
};

app.init = () => {
  // bind all form submissions
  app.bindForms();
};

window.onload = () => {
  app.init();
};
