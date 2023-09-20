const express = require('express')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

app.post('/submit', async(req, res)=>{
    try{
        const { name, email, age } = req.body;

        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT,
            key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
            scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const doc = new GoogleSpreadsheet('1QRTQjWFAxPNUYm3U5RZxxwRWgDFBkLtK2bCwTKg3vWs', serviceAccountAuth);

        await doc.loadInfo();
        console.log(doc.title);

        const sheet = doc.sheetsByIndex[0]; 
        console.log(sheet.title);
        console.log(sheet.rowCount);
        await sheet.addRow({ Name: name, Email: email, Age: age });
        res.sendFile(__dirname + '/confirmation.html');

    } catch(error){
        console.log("error");
        res.status(500).json({
            error: error,
            msg: "try again"
        })
    }

})
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})