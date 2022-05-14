const express = require("express")
const expressFileUpload = require("express-fileupload")
const fs = require("fs")

const app = express()

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// LIMITE DE CARGA DE 5MB
app.use(expressFileUpload({
    limits: {fileSize: 50 * 1024 * 1024} //5MB
}))


// RUTA IMAGEN QUE RECIBE Y ALMACENA LAS IMAGENES
app.post("/imagen", (req, res) => { 

    const {posicion} = req.body
    
    // MENSAJE DE LIMITE EXCEDIDO
    if(req.files.target_file.size >= 52428800){
        return res.send("La imagen sobrepasa el limite de 5MB")
    }

    const ruta = `${__dirname}/public/imgs/imagen-${posicion}.jpg`
    req.files.target_file.mv(ruta, err => {
        if(err){
            console.log(err)
            return res.send("algo fallo")
        }
        return res.redirect("/collage.html")
    })
 })


 // RUTA DELETE PARA ELIMINAR IMAGENES
 app.get("/deleteImg/:nombre", (req, res) => { 
    const {nombre} = req.params

    fs.unlink(`${__dirname}/public/imgs/${nombre}`, err => {

        if(err){
            if(err.code == "ENOENT"){
                return res.redirect("/collage.html")
            }
            return res.send("fallo eliminar el archivo")
        }
        return res.redirect("/collage.html")
    })
  })

app.listen(5000, () => console.log("SERVER ON"))