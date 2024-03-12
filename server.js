const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/validar_cedula', (req, res) => {
    const { cedula } = req.body;

    if (cedula) {
        const esValida = validarCedula(cedula);
        res.json({ esValida });
    } else {
        res.status(400).json({ error: 'Datos de entrada incorrectos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


function validarCedula(cedula) {
    cedula = cedula.replace(/\s+/g, '').replace(/-/g, '');
    console.log("dato = " + cedula);
    if (cedula.length !== 11) {
        return false;
    }

    if (!/^\d{11}$/.test(cedula)) {
        return false;
    }
    console.log("paso validacion");

    var suma = 0;
    for (var i = 0; i < 10; i++) {
        var digito = parseInt(cedula[i]);
        if (i % 2 === 0) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        suma += digito;
    }

    var digitoVerificador = 10 - (suma % 10);

    console.log("digito Verificador => " + digitoVerificador);


    return digitoVerificador === parseInt(cedula[10]);
}
