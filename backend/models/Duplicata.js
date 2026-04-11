const mongoose = require('mongoose');

const DuplicataSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  valor: { type: Number, required: true },
  vencimento: { type: Date, required: true },
  status: { type: String, enum: ['Pendente', 'Pago', 'Vencido', 'Cancelado'], default: 'Pendente' },
  prioridade: { type: String, enum: ['Baixa', 'Média', 'Alta', 'Urgente'], default: 'Média' },
  categoria: { type: String, default: 'Geral' },
  observacoes: { type: String },
  responsavel: { type: String },
  dataCriacao: { type: Date, default: Date.now },
  dataAtualizacao: { type: Date, default: Date.now },
  historico: [{
    acao: String,
    data: { type: Date, default: Date.now },
    usuario: String,
    detalhes: String
  }]
});

// Middleware para atualizar dataAtualizacao e registrar histórico
DuplicataSchema.pre('save', function(next) {
  this.dataAtualizacao = new Date();

  if (this.isModified() && !this.isNew) {
    const mudancas = this.modifiedPaths();
    mudancas.forEach(campo => {
      if (campo !== 'dataAtualizacao' && campo !== 'historico') {
        this.historico.push({
          acao: 'Atualização',
          detalhes: `Campo ${campo} alterado para: ${this[campo]}`
        });
      }
    });
  }

  next();
});

module.exports = mongoose.model('Duplicata', DuplicataSchema);