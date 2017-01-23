module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  },
  networks: {
  	"net42": {
  		network_id: 42
  	},
  	"b9lab": {
  		network_id: 14658
  	},
  	"mainnet": {
  		network_id: 1
  	}
  }
};
