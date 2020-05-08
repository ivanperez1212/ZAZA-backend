const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../../models/usuario");
const confirmEmail = require('../../../scripts/email/confirmacion')
const app = express();

app.get("/obtener", (req, res) => {

  Usuario.find().exec((err, usrDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    return res.status(200).json({
      ok: true,
      count: usrDB.length,
      msg: `Se encontraron ${usrDB.length} usuarios`,
      cont: usrDB
    });
  });
});

app.get("/confirmar/:id",(req,res)=>{
  let id = req.params.id
  Usuario.findByIdAndUpdate(
    id,
    {emailConfirmado:true},
    { new: true, runValidators: true, context: "query" },
    (err, usrDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.status(200).json({
        ok: true,
        msg: `Usuario confirmado correctamente`,
        cont: usrDB
      });
    }
  );
})

app.post("/registrar", (req, res) => {
  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    apellidos: body.apellidos,
    username:body.username,
    email: body.email,
    contraseña: bcrypt.hashSync(body.contraseña, 10),
    img: body.img
  });
  
  usuario.save((err, usrDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }else{
      confirmEmail(usrDB._id,usrDB.email)
    return res.status(200).json({
      ok: true,
      msg: `Se registro correctamente el usuario ${usuario.nombre}`,
      cont: usrDB
    });
  }
  });
});
/*
app.put("/actualizar/:id", (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["nombre", "apellidos", "img"]);

  Usuario.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true, context: "query" },
    (err, usrDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.status(200).json({
        ok: true,
        msg: `Usuario actualizado correctamente`,
        cont: usrDB
      });
    }
  );
});

app.delete("/eliminar/:id", (req, res) => {
  let id = req.params.id;

  Usuario.findByIdAndUpdate(
    id,
    { estatus: false },
    { new: true, runValidators: true, context: "query" },
    (err, usrDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      return res.status(200).json({
        ok: true,
        msg: `Articulo eliminado correctamente`,
        cont: usrDB
      });
    }
  );
});*/
module.exports = app;