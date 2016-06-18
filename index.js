'use strict'

const ndjson = require('ndjson')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const ws = require('./ws-server')



const db = ndjson.stringify()
db.pipe(fs.createWriteStream('data.ndjson', {flags: 'a'}))



const realtime = ws()
realtime.listen(3002)



const wolke = express()
wolke.use(bodyParser.urlencoded({extended: true}))

wolke.get('/', (req, res) => {
	res.status(200)
	fs.createReadStream('data.ndjson')
	.pipe(res)
})

wolke.post('/', (req, res) => {
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

wolke.listen(3001)

