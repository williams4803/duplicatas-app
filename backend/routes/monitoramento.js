const express = require('express');
const router = express.Router();
const Duplicata = require('../models/Duplicata');

// Estatísticas gerais
router.get('/stats', async (req, res) => {
  try {
    const total = await Duplicata.countDocuments();
    const pendentes = await Duplicata.countDocuments({ status: 'Pendente' });
    const pagas = await Duplicata.countDocuments({ status: 'Pago' });
    const vencidas = await Duplicata.countDocuments({ status: 'Vencido' });

    const valorTotal = await Duplicata.aggregate([
      { $group: { _id: null, total: { $sum: '$valor' } } }
    ]);

    const valorPendente = await Duplicata.aggregate([
      { $match: { status: 'Pendente' } },
      { $group: { _id: null, total: { $sum: '$valor' } } }
    ]);

    res.json({
      totalDuplicatas: total,
      pendentes,
      pagas,
      vencidas,
      valorTotal: valorTotal[0]?.total || 0,
      valorPendente: valorPendente[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Alertas de vencimento (próximos 7 dias)
router.get('/alerts', async (req, res) => {
  try {
    const hoje = new Date();
    const proximaSemana = new Date();
    proximaSemana.setDate(hoje.getDate() + 7);

    const duplicatasVencendo = await Duplicata.find({
      vencimento: { $gte: hoje, $lte: proximaSemana },
      status: 'Pendente'
    }).sort({ vencimento: 1 });

    const duplicatasVencidas = await Duplicata.find({
      vencimento: { $lt: hoje },
      status: 'Pendente'
    }).sort({ vencimento: -1 });

    res.json({
      vencendo: duplicatasVencendo,
      vencidas: duplicatasVencidas
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar duplicatas por status
router.get('/status/:status', async (req, res) => {
  try {
    const duplicatas = await Duplicata.find({ status: req.params.status })
      .sort({ vencimento: 1 });
    res.json(duplicatas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Buscar duplicatas por prioridade
router.get('/prioridade/:prioridade', async (req, res) => {
  try {
    const duplicatas = await Duplicata.find({ prioridade: req.params.prioridade })
      .sort({ vencimento: 1 });
    res.json(duplicatas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Atualizar status com histórico
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, usuario } = req.body;
    const duplicata = await Duplicata.findById(req.params.id);

    if (!duplicata) return res.status(404).json({ message: 'Duplicata não encontrada' });

    duplicata.status = status;
    duplicata.historico.push({
      acao: 'Mudança de Status',
      usuario: usuario || 'Sistema',
      detalhes: `Status alterado para: ${status}`
    });

    await duplicata.save();
    res.json(duplicata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;