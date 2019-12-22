'use strict';
var jsdom = require('jsdom');

//const url = "http://www1.caixa.gov.br/loterias/loterias/quina/quina_pesquisa_new.asp";
const url ="http://www1.caixa.gov.br/loterias/loterias/quina/quina_pesquisa_new.asp?submeteu=sim&opcao=concurso&txtConcurso=5149";
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
                    nome:"QUINA",
                    numero_concurso:html[0],
                    data_concurso:html[16],
                    data_concurso_milliseconds:1561777200000,
                    local_realizacao:html[4],
                    rateio_processamento:false,
                    acumulou:html[6],
                    valor_acumulado:0,
                    dezenas: dezenas.slice(5, 10),
                    premiacao:[  
                       {  
                          nome:"Quina",
                          quantidade_ganhadores:html[6],
                          valor_total:html[7],
                          acertos:5
                       },
                       {  
                          nome:"Quadra",
                          quantidade_ganhadores:126,
                          valor_total:3932.37,
                          acertos:4
                       },
                       {  
                          nome:"Terno",
                          quantidade_ganhadores:8383,
                          valor_total:88.88,
                          acertos:3
                       },
                       {  
                          nome:"Duque",
                          quantidade_ganhadores:192241,
                          valor_total:2.13,
                          acertos:2
                       }
                    ],
                    local_ganhadores:[  

                    ],
                    arrecadacao_total:8593930.5,
                    data_proximo_concurso:"2019-07-01T00:00:00-03:00",
                    data_proximo_concurso_milliseconds:1561950000000,
                    valor_estimado_proximo_concurso:html[17],
                    valor_acumulado_especial:1697103.9,
                    nome_acumulado_especial:"S\u00e3o Jo\u00e3o"
                 };
                /*
                var retorno = {
                    numero: html[0],
                    data: html[16],
                    cidade: html[2] + '/' + html[3],
                    local: html[4],
                    valorAcumulado: html[13],
                    dezenas: dezenas.slice(5, 10),
                    premiacao: {
                        quina: {
                            ganhadores: html[6],
                            valorPago: html[7]
                        },
                        quadra: {
                            ganhadores: html[8],
                            valorPago: html[9]
                        },
                        terno: {
                            ganhadores: html[10],
                            valorPago: html[11]
                        },
                        duque: {
                            ganhadores: html[23],
                            valorPago: html[22]
                        }
                    },
                    arrecadacaoTotal: html[20],
                    proximoConcurso: {
                        data: html[18],
                        valorEstimado: html[17],
                    },
                    valorAcumuladoQuinaSaoJoao: html[21]
                };
                 */

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

               var html = window.$("html").text().split("|");

                if (html.length < 4) {
                    return res.status(404).json({ error: "Resultado não encontrado" });
                }


                var retorno = {
                    numero: html[0],
                    data: html[16],
                    cidade: html[2] + '/' + html[3],
                    local: html[4],
                    valorAcumulado: html[13],
                    dezenas: dezenas.slice(5, 10),
                    premiacao: {
                        quina: {
                            ganhadores: html[6],
                            valorPago: html[7]
                        },
                        quadra: {
                            ganhadores: html[8],
                            valorPago: html[9]
                        },
                        terno: {
                            ganhadores: html[10],
                            valorPago: html[11]
                        },
                        duque: {
                            ganhadores: html[23],
                            valorPago: html[22]
                        }
                    },
                    arrecadacaoTotal: html[20],
                    proximoConcurso: {
                        data: html[18],
                        valorEstimado: html[17],
                    },
                    valorAcumuladoQuinaSaoJoao: html[21]
                };

                res.json(retorno);
            }
        );
    }
}
