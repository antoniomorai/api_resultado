'use strict';
var jsdom = require('jsdom');

const url = "http://www1.caixa.gov.br/loterias/loterias/timemania/timemania_pesquisa.asp";
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
                    nome:"TIMEMANIA",
                    numero_concurso:html[0],
                    data_concurso:html[2],
                    data_concurso_milliseconds:1556593200000,
                    local_realizacao:html[5],
                    rateio_processamento:false,
                    acumulou:html[9],
                    valor_acumulado:0,
                    dezenas:[  
                       "04",
                       "05",
                       "06",
                       "22",
                       "40",
                       "62",
                       "63"
                    ],
                    nome_time_coracao:"Bangu\/RJ",
                    dezena_time_coracao:"11",
                    premiacao:[  
                       {  
                          nome:"7 Acertos",
                          quantidade_ganhadores:html[9],
                          valor_total:html[],
                          acertos:7
                       },
                       {  
                          nome:"6 Acertos",
                          quantidade_ganhadores:6,
                          valor_total:24210.8,
                          acertos:6
                       },
                       {  
                          nome:"5 Acertos",
                          quantidade_ganhadores:230,
                          valor_total:902.26,
                          acertos:5
                       },
                       {  
                          nome:"4 Acertos",
                          quantidade_ganhadores:4500,
                          valor_total:6,
                          acertos:4
                       },
                       {  
                          nome:"3 Acertos",
                          quantidade_ganhadores:45485,
                          valor_total:2,
                          acertos:3
                       },
                       {  
                          nome:"Time do coração",
                          quantidade_ganhadores:12352,
                          valor_total:5,
                          acertos:1,
                          time:true
                       }
                    ],
                    local_ganhadores:[  
                       {  
                          local:"S\u00c3\u0192O PAULO\/SP",
                          cidade:"S\u00c3\u0192O PAULO",
                          uf:"SP",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       }
                    ],
                    arrecadacao_total:2646382,
                    data_proximo_concurso:"2019-05-02T00:00:00-03:00",
                    data_proximo_concurso_milliseconds:1556766000000,
                    valor_estimado_proximo_concurso:100000
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
