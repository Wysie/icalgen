/**
* JSONP implementation of the bit.ly API for dynamic
* URL shortening
*
* @author = "Kai Mallea (kmallea@gmail.com)"
*
* TODO: Add domain param to choose between bit.ly and j.mp
*/


var Bitly = (function () {
    var x_login,
        x_apiKey,
        format = 'json',
        apiUrl = "http://api.bit.ly/v3/shorten?",
        callbackHandler,
        e,
        head = document.getElementsByTagName("head")[0];

    function constructUrl (longUrl) {
        var q = "";
        
        if (x_login && x_apiKey) {
            q += "login=" + x_login + "&apiKey=" + x_apiKey + "&";
        }
        
        q += "longUrl=" + encodeURIComponent(longUrl) + "&format=json&callback=Bitly.callback";
        
        return apiUrl + q;
    }
    
    return {
        setLogin: function (login) {
            x_login = login || "";
            return this;
        },
        
        setKey: function (apiKey) {
            x_apiKey = apiKey || "";
            return this;
        },

        setCallback: function (fn) {
            if (typeof fn !== 'function') {
                throw new Error("Bitly: callback must be a function.");
            }

            callbackHandler = fn;

            return this;
        },

        shorten: function (longUrl) {
            e = document.createElement("script");
            e.src = constructUrl(longUrl);
                
            head.appendChild(e);
        },
        
        // TODO
        expand: function (shortUrl) {
        },

        // TODO
        validate: function () {
        },

        callback: function (response) {
            callbackHandler(response);
        }
    };
}());

/*******

// Example

function myCallback (response) {
    alert(response.data.url || response.status_code + ": " + response.status_txt);
}


// Chaining works for initialization
var b = Bitly
  .setLogin("bitlyapidemo")
  .setKey("R_0da49e0a9118ff35f52f629d2d71bf07")
  .setCallback(myCallback);

b.shorten("http://sc2.mallea.net/#p|0013|0251|0013|0221|0171|0014|0251|0181|0014|0171|0011|0022|0252|0301|0022|0371|0221|0012|0191|0251|0221|0123");

b.shorten("http://code.google.com/chrome/extensions/devguide.html");

*******/