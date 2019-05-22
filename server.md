# WebSocket & HTTP Server

## Usage

Install the dependencies with `yarn install` or `npm install`.

Run the `start` script with `yarn start` or `npm start`. This will run an HTTP and WS server on the port 3000.

If you want to customize the port run `PORT=8080 yarn start` or `PORT=8080 npm start`.

Inside the `public` directory your could add files to be served by the HTTP server, they will all be served at the root of the site, that means `public/index.html` will be accessed at `http://localhost:3000/`.

If you want to connect to the WebSocket server use the URL `ws://localhost:3000`.
