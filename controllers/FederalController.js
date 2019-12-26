

'use strict';
var jsdom = require('jsdom');



const url = "http://www.loterias.caixa.gov.br/wps/portal/loterias/landing/federal/";
//const url = "http://www1.caixa.gov.br/loterias/loterias/megasena/megasena_pesquisa_new.asp";
const query = "?submeteu=sim&opcao=concurso&txtConcurso=";

module.exports = {
    ultimoResultado: function (req, res, next) {

        jsdom.env(
            url,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                var dezenas = [];
                window.$("table td").each(function () { dezenas.push(window.$(this).html()) });

                var html = window.$("html").text().split("|");
                //var cond = window.$("h2").text().split(")</h");
                var cond = window.$("h2").text().split(")</h");
                
                var informa = [];
                window.$("h2").each(function () { informa.push(window.$(this).text()) });
        
              

                
                var dds = dezenas.slice(1,2);

                if (html.length < 4) {
                    return res.status(404).json({ error: "Resultado não encontrado" });
                }

                var retorno = {  
                    nome:"FEDERAL",
                    numero_concurso:dezenas[1].slice(0,6),
                    data_concurso:informa[10].substring(0, 26),
                    data_concurso_milliseconds:1562382000000,
                    local_realizacao:"SAO PAULO, SP",
                    rateio_processamento:false,
                    premiacao:[  
                       {  
                          nome:"1\u00ba Pr\u00eamio",
                          bilhete:dezenas[1].slice(0,6),
                          valor_total:dezenas[4].slice(0,20),
                          faixa:1
                       },
                       {  
                          nome:"2\u00ba Pr\u00eamio",
                          bilhete:dezenas[6].slice(0,6),
                          valor_total:dezenas[9].slice(0,20),
                          faixa:2
                       },
                       {  
                          nome:"3\u00ba Pr\u00eamio",
                          bilhete:dezenas[11].slice(0,6),
                          valor_total:dezenas[14].slice(0,20),
                          faixa:3
                       },
                       {  
                          nome:"4\u00ba Pr\u00eamio",
                          bilhete:dezenas[16].slice(0,6),
                          valor_total:dezenas[19].slice(0,20),
                          faixa:4
                       },
                       {  
                          nome:"5\u00ba Pr\u00eamio",
                          bilhete:dezenas[21].slice(0,6),
                          valor_total:dezenas[24].slice(0,20),
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
