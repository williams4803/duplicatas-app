require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || "mongodb://ac-jrtuibl-shard-00-00.qyndjft.mongodb.net:27017,ac-jrtuibl-shard-00-01.qyndjft.mongodb.net:27017,ac-jrtuibl-shard-00-02.qyndjft.mongodb.net:27017/duplicatas?ssl=true&authSource=admin&retryWrites=true&w=majority";
const mongoOptions = {
  serverSelectionTimeoutMS: 30000,
};

if (!process.env.MONGODB_URI) {
  mongoOptions.auth = {
    username: process.env.MONGODB_USER || "wcjesus38_db_user",
    password: process.env.MONGODB_PASS || "mh2ovFGaDb76Drx0",
  };
}

const b3Routes = require("./routes/b3");
const duplicatasRoutes = require("./routes/duplicata");
const monitoramentoRoutes = require("./routes/monitoramento");

app.get("/api/health", (req, res) => {
  res.send("API funcionando!");
});

app.use("/duplicatas", duplicatasRoutes);
app.use("/monitoramento", monitoramentoRoutes);
app.use("/b3", b3Routes);

const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/duplicatas") || req.path.startsWith("/monitoramento") || req.path.startsWith("/b3") || req.path.startsWith("/api")) {
    return res.status(404).send("Rota não encontrada");
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

mongoose
  .connect(mongoUri, mongoOptions)
  .then(() => {
    console.log("Banco Conectado");
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log("Erro ao conectar ao banco:", err);
  });