const { response } = require('express');
const express = require('express');
const app = express();
const port = 5000;

app.get('/', (request, response) => {
	return response.sendFile('client/index.html', { root: '.' });
});

app.get('/auth/discord', (request,response) => {
    return response.sendFile('client/dashboard.html', { root: '.' })
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
app.use(express.static('client'));