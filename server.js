const tinylr = require('tiny-lr')

const port = process.env.SERVER_PORT || 35729

const options = {}

if (process.env.LR_SSL_CRT && process.env.LR_SSL_KEY) {
  options.key = fs.readFileSync(process.env.LR_SSL_KEY)
  options.cert = fs.readFileSync(process.env.LR_SSL_CRT)
	
	console.log('SSL enabled')
}

const server = tinylr(options)

server.on('GET /ember-cli-live-reload.js', (req, res) => {
  res.setHeader('content-type', 'application/javascript')
  res.write(`
    (function() {
       var src = 'http://localhost:${port}/livereload.js?snipver=1';
       var script    = document.createElement('script');
       script.type   = 'text/javascript';
       script.src    = src;
       document.getElementsByTagName('head')[0].appendChild(script);
       }());`
     )
  res.end()
})

server.listen(port, () => console.log(`Server listening on ${port}`))
