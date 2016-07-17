process.on('SIGTERM', () => process.exit(0))

const tinylr = require('tiny-lr')

function createEmberScript (port) {
  return `
  (function() {
     var src = 'http://localhost:${port}/livereload.js?snipver=1';
     var script    = document.createElement('script');
     script.type   = 'text/javascript';
     script.src    = src;
     document.getElementsByTagName('head')[0].appendChild(script);
    }());`
  }

function createServer (options = {}, port = 35729) {
  const server = tinylr(options)

  server.on('GET /ember-cli-live-reload.js', (req, res) => {
    res.setHeader('content-type', 'application/javascript')
    const script = createEmberScript(port)
    res.write(script)
    res.end()
  })

  server.listen(port, () => console.log(`Server listening on ${port}`))

  return server
}

// Create https server if ssl is enabled
if (process.env.LR_SSL_CRT && process.env.LR_SSL_KEY) {
  const fs = require('fs')
  const port = process.env.SSL_SERVER_PORT || 35730
  const options = {
    key: fs.readFileSync(process.env.LR_SSL_KEY),
    cert: fs.readFileSync(process.env.LR_SSL_CRT)
  }

	console.log('SSL enabled')
  createServer(options, port)
}

// Create http server
createServer(null, process.env.SERVER_PORT)
