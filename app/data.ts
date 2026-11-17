// Dados extraídos das avaliações físicas do NextFit (AURA GYM).
// Privacidade: contém APENAS medidas corporais e respostas de anamnese.
// Nenhuma foto/imagem, telefone, e-mail, CPF ou dado de contato é incluído.

export type AnamneseItem = {
  pergunta: string;
  resposta: string;
};

export type Avaliacao = {
  dataISO: string;
  idade: number;
  alturaM: number;
  composicao: {
    pesoKg: number;
    classificacaoPeso: string;
    imc: number;
    classificacaoImc: string;
    gorduraPercentual: number;
    gorduraKg: number;
    classificacaoGordura: string;
    massaMagraPercentual: number;
    massaMagraKg: number;
    rcq: number;
    classificacaoRcq: string;
    metabolismoBasalSugeridoKcal: number;
  };
  perimetros: Record<string, number>;
  anamnese: AnamneseItem[];
};

export const aluno = {
  nome: "Gabriel Trajano Bezerril",
  unidade: "AURA GYM",
  sexo: "Masculino",
} as const;

export const avaliacoes: { anterior: Avaliacao; atual: Avaliacao } = {
  anterior: {
  "dataISO": "2026-08-31T20:14:27Z",
  "idade": 23,
  "alturaM": 1.74,
  "composicao": {
    "pesoKg": 53.2,
    "classificacaoPeso": "Abaixo",
    "imc": 17.57,
    "classificacaoImc": "Abaixo do peso",
    "gorduraPercentual": 7.49,
    "gorduraKg": 3.98,
    "classificacaoGordura": "Bom",
    "massaMagraPercentual": 92.52,
    "massaMagraKg": 49.22,
    "rcq": 0.9,
    "classificacaoRcq": "Alto",
    "metabolismoBasalSugeridoKcal": 1513.27
  },
  "perimetros": {
    "Peitoral": 40.0,
    "Cintura": 28.0,
    "Abdômen": 28.0,
    "Quadril": 31.0,
    "Braço relaxado (D)": 24.0,
    "Braço relaxado (E)": 24.0,
    "Braço contraído (D)": 28.0,
    "Braço contraído (E)": 28.0,
    "Antebraço (D)": 22.0,
    "Antebraço (E)": 22.0,
    "Coxa (D)": 44.0,
    "Coxa (E)": 44.0,
    "Panturrilha (D)": 31.0,
    "Panturrilha (E)": 31.0
  },
  "anamnese": [
    {
      "pergunta": "Objetivo atividade física",
      "resposta": "Aumento de massa muscular"
    },
    {
      "pergunta": "Pratica atividade física",
      "resposta": "Sim"
    },
    {
      "pergunta": "Horas de sono",
      "resposta": "7"
    },
    {
      "pergunta": "Horas de sono são suficientes",
      "resposta": "Não"
    },
    {
      "pergunta": "Horas de trabalho",
      "resposta": "10"
    },
    {
      "pergunta": "Atividade profissional",
      "resposta": "T.I"
    },
    {
      "pergunta": "Nível de aptidão física",
      "resposta": "Moderadamente ativo"
    },
    {
      "pergunta": "Hábitos alimentares",
      "resposta": "Come bem"
    },
    {
      "pergunta": "Ingere bebidas alcoólicas",
      "resposta": "Não bebe"
    },
    {
      "pergunta": "Dores na coluna",
      "resposta": "Não possui"
    },
    {
      "pergunta": "Frequência cardíaca em repouso",
      "resposta": "69"
    },
    {
      "pergunta": "Pressão arterial em repouso",
      "resposta": "103x73"
    },
    {
      "pergunta": "Alteração da pressão",
      "resposta": "Não"
    },
    {
      "pergunta": "Anemia",
      "resposta": "Não"
    },
    {
      "pergunta": "Crise respiratória",
      "resposta": "Não"
    },
    {
      "pergunta": "Colesterol elevado",
      "resposta": "Não"
    },
    {
      "pergunta": "Depressão",
      "resposta": "Não"
    },
    {
      "pergunta": "Sono irregular",
      "resposta": "Sim"
    },
    {
      "pergunta": "Diabetes",
      "resposta": "Não"
    },
    {
      "pergunta": "Gastrite",
      "resposta": "Não"
    },
    {
      "pergunta": "Insônia",
      "resposta": "Não"
    },
    {
      "pergunta": "Tensão ombro e pescoço",
      "resposta": "Não"
    },
    {
      "pergunta": "Tireóide",
      "resposta": "Não"
    },
    {
      "pergunta": "Tonturas constantes",
      "resposta": "Não"
    },
    {
      "pergunta": "Varizes",
      "resposta": "Não"
    },
    {
      "pergunta": "Taquicardia",
      "resposta": "Não"
    },
    {
      "pergunta": "Faz uso de medicamentos",
      "resposta": "Não"
    },
    {
      "pergunta": "Fez alguma cirurgia",
      "resposta": "Não"
    }
  ]
},
  atual: {
  "dataISO": "2026-11-16T19:28:11Z",
  "idade": 23,
  "alturaM": 1.72,
  "composicao": {
    "pesoKg": 57.2,
    "classificacaoPeso": "Abaixo",
    "imc": 19.33,
    "classificacaoImc": "Peso normal",
    "gorduraPercentual": 8.73,
    "gorduraKg": 4.99,
    "classificacaoGordura": "Bom",
    "massaMagraPercentual": 91.28,
    "massaMagraKg": 52.21,
    "rcq": 0.79,
    "classificacaoRcq": "Baixo",
    "metabolismoBasalSugeridoKcal": 1558.27
  },
  "perimetros": {
    "Peitoral": 81.0,
    "Cintura": 70.0,
    "Abdômen": 73.5,
    "Quadril": 88.3,
    "Braço relaxado (D)": 27.3,
    "Braço relaxado (E)": 27.5,
    "Braço contraído (D)": 31.1,
    "Braço contraído (E)": 31.0,
    "Antebraço (D)": 23.8,
    "Antebraço (E)": 24.0,
    "Coxa (D)": 43.8,
    "Coxa (E)": 44.5,
    "Panturrilha (D)": 31.1,
    "Panturrilha (E)": 31.0
  },
  "anamnese": [
    {
      "pergunta": "Já Treinou antes",
      "resposta": "Sim"
    },
    {
      "pergunta": "Qual é seu Objetivo",
      "resposta": "Ganho de massa"
    },
    {
      "pergunta": "Qual sua Profissão",
      "resposta": "T.I"
    },
    {
      "pergunta": "Frequência semanal",
      "resposta": "5x"
    },
    {
      "pergunta": "Tempo de Treino por dia",
      "resposta": "1h e 30"
    },
    {
      "pergunta": "Doença/problema de saúde",
      "resposta": "Nao"
    },
    {
      "pergunta": "Limitação de movimento",
      "resposta": "Nao"
    },
    {
      "pergunta": "Dor em algum movimento",
      "resposta": "Nao"
    },
    {
      "pergunta": "Cirurgias",
      "resposta": "Nao"
    },
    {
      "pergunta": "Medicamento controlado",
      "resposta": "Nao"
    },
    {
      "pergunta": "Está fazendo dieta",
      "resposta": "Equilibrada"
    },
    {
      "pergunta": "Dorme quantas horas por noite",
      "resposta": "6"
    },
    {
      "pergunta": "Consumo de Alcool",
      "resposta": "Nao"
    },
    {
      "pergunta": "Fuma",
      "resposta": "Nao"
    }
  ]
},
};

// Meta de peso definida pelo aluno, exibida em destaque no comparativo.
export const meta = {
  pesoKg: 60,
  prazo: "Janeiro de 2027",
} as const;
