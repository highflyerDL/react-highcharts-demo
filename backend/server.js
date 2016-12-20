import express from "express";
import path from "path";
const app = express();

app.use(express.static(path.join(__dirname, '../www')));
app.get('*', function(req, res) {
    res.sendFile(path.resolve(__dirname, '../www', 'index.html'))
});

export default app;