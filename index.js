'use strict'

const ndjson = require('ndjson')
const http = require('http')
const express = require('express')
const corser = require('corser')
const bodyParser = require('body-parser')
const fs = require('fs')

const createWsServer = require('./ws-server')

const db = ndjson.stringify()
db.pipe(fs.createWriteStream('data.ndjson', {flags: 'a'}))

const api = express()
const server = http.createServer(api)
const realtime = createWsServer(server)

api.use(corser.create())
api.use(bodyParser.urlencoded({extended: true}))
api.use(bodyParser.json())

api.get('/', (req, res) => {
	res.status(200)
	fs.createReadStream('data.ndjson')
	.pipe(res)
})

api.post('/', (req, res) => {
	const data = {
		  when:      +req.body.when
		, latitude:  +req.body.latitude
		, longitude: +req.body.longitude
		, line:       req.body.line
	}
	realtime.publish(JSON.stringify(data))
	db.write(data)
	res.status(200).end()
})

const port = process.env.PORT || 3000
server.listen(port, (err) => {
	if (err) {
		console.error(err)
		process.exit(1)
	} else console.info(`Listening on port ${port}.`)
})
