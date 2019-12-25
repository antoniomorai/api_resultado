'use strict';
var jsdom = require('jsdom');

//const url = "http://www1.caixa.gov.br/loterias/loterias/federal/federal_pesquisa.asp";
const url = "http://www.loterias.caixa.gov.br/wps/portal/loterias/landing/federal/";
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
                    nome:"FEDERAL",
                    numero_concurso:html[2],
                    data_concurso:html[16],
                    data_concurso_milliseconds:1562382000000,
                    local_realizacao:html[3],
                    rateio_processamento:false,
                    premiacao:[  
                       {  
                          nome:"1\u00ba Pr\u00eamio",
                          bilhete:html[6],
                          valor_total:html[7],
                          faixa:1
                       },
                       {  
                          nome:"2\u00ba Pr\u00eamio",
                          bilhete:html[8],
                          valor_total:html[9],
                          faixa:2
                       },
                       {  
                          nome:"3\u00ba Pr\u00eamio",
                          bilhete:html[10],
                          valor_total:html[11],
                          faixa:3
                       },
                       {  
                          nome:"4\u00ba Pr\u00eamio",
                          bilhete:html[12],
                          valor_total:html[13],
                          faixa:4
                       },
                       {  
                          nome:"5\u00ba Pr\u00eamio",
                          bilhete:html[14],
                          valor_total:html[15],
                          faixa:5
                       }
                    ],
                    data_proximo_concurso:"2019-07-10T00:00:00-03:00",
                    data_proximo_concurso_milliseconds:1562727600000,
                    valor_estimado_proximo_concurso:500000
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
