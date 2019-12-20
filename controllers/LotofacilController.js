'use strict';
var jsdom = require('jsdom');

const url = "http://www.loterias.caixa.gov.br/wps/portal/loterias/landing/quina/!ut/p/a1/jc69DoIwAATgZ_EJepS2wFgoaUswsojYxXQyTfgbjM9vNS4Oordd8l1yxJGBuNnfw9XfwjL78dmduIikhYFGA0tzSFZ3tG_6FCmP4BxBpaVhWQuA5RRWlUZlxR6w4r89vkTi1_5E3CfRXcUhD6osEAHA32Dr4gtsfFin44Bgdw9WWSwj/dl5/d5/L2dJQSEvUUt3QS80SmlFL1o2XzYxTDBIMEcwSjBJMjgwQTRFUDJWSlYzMDM1/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_61L0H0G0J0VSC0AC4GLFAD20G6/res/id=buscaResultado/c=cacheLevelPage/=/?timestampAjax=1565647821868";
const query = "?submeteu=sim&opcao=concurso&txtConcurso=";

module.exports = {
    ultimoResultado: function (req, res, next) {

        jsdom.env(
            url,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
                var dezenas = [];
                window.$("ul li").each(function () { dezenas.push(window.$(this).text()) });

                var html = window.$("html").text().split(",");
                

                if (html.length < 4) {
                    return res.status(404).json({ error: "Resultado não encontrado" });
                }

                var retorno = {
                    nome:"LOTOFÁCIL",
                    numero_concurso:html[4].substring(11),
                    data_concurso:html[34].substring(11, 21),
                    data_concurso_milliseconds:html[5].substring(7),
                    local_realizacao:html[15].substring(13, 22),
                    rateio_processamento:false,
                    acumulou:false,
                    valor_acumulado:0,
                    dezenas:["05","37","43","49", "54","56"],
                    valor_estimado_proximo_concurso:3000000,
                    //premiacao:[{"nome":"Sena","quantidade_ganhadores":1,"valor_total":35218398.02,"acertos":6}],
                   

                    dezenas: dezenas.slice(6, 12),
                    premiacao2: {
                        sena: {
                            ganhadores: 0,
                            valorPago: 0
                        },
                        quina: {
                            ganhadores: 0,
                            valorPago: 0
                        },
                        quadra: {
                            ganhadores: 0,
                            valorPago: 0
                        }
                    },

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
