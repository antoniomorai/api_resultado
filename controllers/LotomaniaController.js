'use strict';
var jsdom = require('jsdom');

const url = "http://www1.caixa.gov.br/loterias/loterias/megasena/megasena_pesquisa_new.asp";
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
                    nome:"LOTOMANIA",
                    numero_concurso:1979,
                    data_concurso:"2019-06-18T00:00:00-03:00",
                    data_concurso_milliseconds:1560826800000,
                    local_realizacao:"S\u00c3O PAULO, SP",
                    rateio_processamento:false,
                    acumulou:false,
                    valor_acumulado:0,
                    dezenas:[  
                       "03",
                       "10",
                       "26",
                       "29",
                       "31",
                       "36",
                       "40",
                       "56",
                       "58",
                       "62",
                       "66",
                       "68",
                       "74",
                       "77",
                       "79",
                       "87",
                       "88",
                       "92",
                       "93",
                       "95"
                    ],
                    premiacao:[  
                       {  
                          nome:"20 Acertos",
                          quantidade_ganhadores:1,
                          valor_total:3853402.35,
                          acertos:20
                       },
                       {  
                          nome:"19 Acertos",
                          quantidade_ganhadores:2,
                          valor_total:130168.68,
                          acertos:19
                       },
                       {  
                          nome:"18 Acertos",
                          quantidade_ganhadores:122,
                          valor_total:1333.69,
                          acertos:18
                       },
                       {  
                          nome:"17 Acertos",
                          quantidade_ganhadores:1067,
                          valor_total:152.49,
                          acertos:17
                       },
                       {  
                          nome:"16 Acertos",
                          quantidade_ganhadores:6905,
                          valor_total:23.56,
                          acertos:16
                       },
                       {  
                          nome:"15 Acertos",
                          quantidade_ganhadores:28567,
                          valor_total:5.69,
                          acertos:15
                       },
                       {  
                          nome:"0 Acertos",
                          quantidade_ganhadores:1,
                          valor_total:130168.71,
                          acertos:0
                       }
                    ],
                    local_ganhadores:[  
                       {  
                          local:"FRANCA\/SP",
                          cidade:"FRANCA",
                          uf:"SP",
                          quantidade_ganhadores:2,
                          canal_eletronico:false
                       }
                    ],
                    arrecadacao_total:5362120.5,
                    data_proximo_concurso:"2019-06-21T00:00:00-03:00",
                    data_proximo_concurso_milliseconds:1561086000000,
                    valor_estimado_proximo_concurso:400000
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