'use strict'

const ws = require('nodejs-websocket')

const server = () => {
	const connections = []
	const server = ws.createServer((connection) => {
		connections.push(connection)
		connection.on('close', () => {
			const i = connections.indexOf(connection)
			if (i >= 0) connections.splice(i, 1)
		})
	})
	server.publish = (msg) => {
		for (let connection of connections) connection.sendText(msg)
	}
	return server
}

module.exports = server
