import express from 'express'
import path from 'path'
const app = express()

app.get('/', function(request, response){
  response.sendFile(path.join(path.resolve(), '/index.html'));
})

app.use('/dist', express.static('dist'))
app.use('/tiles', express.static('tiles'))

app.listen(3000, () => {
  console.log("Listen on the port 3000...")
  console.log("http://127.0.0.1:3000")
})