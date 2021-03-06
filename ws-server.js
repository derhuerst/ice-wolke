'use strict'

const {Server} = require('ws')

const createServer = (httpServer) => {
	const server = new Server({server: httpServer})

	const connections = []
	server.on('connection', (connection) => {
		connections.push(connection)
		connection.once('close', () => {
			const i = connections.indexOf(connection)
			if (i >= 0) connections.splice(i, 1)
		})
	})

	server.publish = (msg) => {
		for (let connection of connections) connection.send(msg)
	}

	return server
}

module.exports = createServer
