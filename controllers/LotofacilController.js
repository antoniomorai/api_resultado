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

                var html = window.$("html").text().split("_");
                

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
                    acumulou:false,
                    valor_acumulado:0,
                    dezenas:[html[3],
                             html[4],
                             html[5],
                             html[6],
                             html[7],
                             html[8],
                             html[9],
                             html[10],
                             html[11],html[12],html[13],html[14],html[15],html[16],html[17]],
                    teste: html[3],
                    numero: html[0],//ok
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
