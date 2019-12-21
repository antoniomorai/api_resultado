'use strict';
var jsdom = require('jsdom');

const url = "http://www1.caixa.gov.br/loterias/loterias/lotofacil/lotofacil_pesquisa_new.asp";
const query = "?submeteu=sim&opcao=concurso&txtConcurso=";

module.exports = {
    ultimoResultado: function (req, res, next) {

        jsdom.env(
            url,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                var dezenas = [];
                window.$("ul li").each(function () { dezenas.push(window.$(this).text()) });

                var html = window.$("html").text().split("|");
                

                if (html.length < 4) {
                    return res.status(404).json({ error: "Resultado não encontrado" });
                }

                var retorno = {  
                    nome:"LOTOFÁCIL",
                    numero_concurso:html[0],
                    data_concurso:html[34],
                    data_concurso_milliseconds:1562122800000,
                    local_realizacao:html[31],
                    rateio_processamento:false,
                    acumulou:html[36],
                    valor_acumulado:0,
                    dezenas:[  
                       "01",
                       "04",
                       "06",
                       "07",
                       "11",
                       "13",
                       "14",
                       "15",
                       "16",
                       "18",
                       "20",
                       "21",
                       "22",
                       "23",
                       "24"
                    ],
                    premiacao:[  
                       {  
                          nome:"15 Acertos",
                          quantidade_ganhadores:5,
                          valor_total:454417.95,
                          acertos:15
                       },
                       {  
                          nome:"14 Acertos",
                          quantidade_ganhadores:515,
                          valor_total:1357.49,
                          acertos:14
                       },
                       {  
                          nome:"13 Acertos",
                          quantidade_ganhadores:15571,
                          valor_total:20,
                          acertos:13
                       },
                       {  
                          nome:"12 Acertos",
                          quantidade_ganhadores:199004,
                          valor_total:8,
                          acertos:12
                       },
                       {  
                          nome:"11 Acertos",
                          quantidade_ganhadores:1090310,
                          valor_total:4,
                          acertos:11
                       }
                    ],
                    local_ganhadores:[  
                       {  
                          local:"MORRO DO CHAP\u00c9U\/BA",
                          cidade:"MORRO DO CHAP\u00c9U",
                          uf:"BA",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       },
                       {  
                          local:"MINA\u00c7U\/GO",
                          cidade:"MINA\u00c7U",
                          uf:"GO",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       },
                       {  
                          local:"CONTAGEM\/MG",
                          cidade:"CONTAGEM",
                          uf:"MG",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       },
                       {  
                          local:"UBERL\u00c2NDIA\/MG",
                          cidade:"UBERL\u00c2NDIA",
                          uf:"MG",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       },
                       {  
                          local:"PASSO FUNDO\/RS",
                          cidade:"PASSO FUNDO",
                          uf:"RS",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       }
                    ],
                    arrecadacao_total:25971124,
                    data_proximo_concurso:"2019-07-05T00:00:00-03:00",
                    data_proximo_concurso_milliseconds:1562295600000,
                    valor_estimado_proximo_concurso:2000000,
                    valor_acumulado_especial:58710299.06,
                    nome_acumulado_especial:"Independ\u00eancia"
                 };

                res.json(retorno);
            }
        );
    },

    resultadoDoConcurso: function (req, res, next) {
        var concurso = req.params.concurso;

        jsdom.env(
            url + query + concurso,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                var dezenas = [];
                window.$("ul li").each(function () { dezenas.push(window.$(this).text()) });

                var html = window.$("html").text().split("|");;

                if (html.length < 4) {
                    return res.status(404).json({ error: "Resultado não encontrado" });
                }

                var retorno = {
                    numero: html[0],
                    data: html[11],
                    cidade: html[12] + '/' + html[13],
                    local: html[14],
                    valorAcumulado: html[1],
                    dezenas: dezenas.slice(6, 12),
                    premiacao: {
                        sena: {
                            ganhadores: html[3],
                            valorPago: html[4]
                        },
                        quina: {
                            ganhadores: html[5],
                            valorPago: html[6]
                        },
                        quadra: {
                            ganhadores: html[7],
                            valorPago: html[8]
                        }
                    },
                    arrecadacaoTotal: html[24],
                    proximoConcurso: {
                        data: html[22],
                        valorEstimado: html[21],
                    },
                    valorAcumuladoFinalCinco: html[18],
                    valorAcumuladoMegaVirada: html[23]
                };

                res.json(retorno);
            }
        );
    }
}
