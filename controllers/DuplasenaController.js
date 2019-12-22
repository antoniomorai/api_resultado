'use strict';
var jsdom = require('jsdom');

const url = "http://www1.caixa.gov.br/loterias/loterias/duplasena/duplasena_pesquisa_new.asp";
//const url ="http://www1.caixa.gov.br/loterias/loterias/duplasena/duplasena_pesquisa_new.asp?submeteu=sim&opcao=concurso&txtConcurso=2013";
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
                    nome:"DUPLASENA",
                    numero_concurso:html[0],
                    data_concurso:html[17],
                    data_concurso_milliseconds:1559358000000,
                    local_realizacao:html[14],
                    rateio_processamento:false,
                    acumulou:html[6],
                    valor_acumulado:html[22],
                    dezenas:dezenas.slice(0, 6),
                    dezenas_2:dezenas.slice(6, 12),
                    premiacao:[  
                       {  
                          nome:"Sena",
                          quantidade_ganhadores:html[6],
                          valor_total:html[7],
                          acertos:6
                       },
                       {  
                          nome:"Quina",
                          quantidade_ganhadores:36,
                          valor_total:html[26],
                          acertos:5
                       },
                       {  
                          nome:"Quadra",
                          quantidade_ganhadores:1315,
                          valor_total:72.35,
                          acertos:4
                       },
                       {  
                          nome:"Terno",
                          quantidade_ganhadores:23626,
                          valor_total:2.01,
                          acertos:3
                       }
                    ],
                    premiacao_2:[  
                       {  
                          nome:"Sena",
                          quantidade_ganhadores:0,
                          valor_total:0,
                          acertos:6
                       },
                       {  
                          nome:"Quina",
                          quantidade_ganhadores:16,
                          valor_total:4683.12,
                          acertos:5
                       },
                       {  
                          nome:"Quadra",
                          quantidade_ganhadores:1131,
                          valor_total:84.12,
                          acertos:4
                       },
                       {  
                          nome:"Terno",
                          quantidade_ganhadores:21824,
                          valor_total:2.17,
                          acertos:3
                       }
                    ],
                    local_ganhadores:[  
                       {  
                          local:"ITAJA\u00cd\/SC",
                          cidade:"ITAJA\u00cd",
                          uf:"SC",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       }
                    ],
                    arrecadacao_total:2743672,
                    data_proximo_concurso:"2019-06-04T00:00:00-03:00",
                    data_proximo_concurso_milliseconds:1559617200000,
                    valor_estimado_proximo_concurso:html[22],
                    valor_acumulado_especial:1744838.08,
                    nome_acumulado_especial:"P\u00e1scoa"
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
