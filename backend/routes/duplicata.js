const express = require('express');
const router = express.Router();
const Duplicata = require('../models/Duplicata');

// Criar uma nova duplicata
router.post('/', async (req, res) => {
  const nova = new Duplicata(req.body);
  await nova.save();
    res.json(nova);
});

// Listar todas as duplicatas
router.get('/', async (req, res) => {
  const dados = await Duplicata.find();
  res.json(dados);
});

// Buscar duplicata por ID
router.get('/:id', async (req, res) => {
  try {
    const duplicata = await Duplicata.findById(req.params.id);
    if (!duplicata) return res.status(404).json({ message: 'Duplicata não encontrada' });
    res.json(duplicata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar duplicata
router.put('/:id', async (req, res) => {
  try {
    const duplicata = await Duplicata.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!duplicata) return res.status(404).json({ message: 'Duplicata não encontrada' });
    res.json(duplicata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Deletar duplicata
router.delete('/:id', async (req, res) => {
  try {
    const duplicata = await Duplicata.findByIdAndDelete(req.params.id);
    if (!duplicata) return res.status(404).json({ message: 'Duplicata não encontrada' });
    res.json({ message: 'Duplicata deletada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;