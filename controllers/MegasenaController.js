'use strict';
var jsdom = require('jsdom');

const url = "http://www1.caixa.gov.br/loterias/loterias/megasena/megasena_pesquisa_new.asp";    //URL
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
                
                var ac = html[3];
                //var res = "false";
                
                //if(acumulou == "0"){ res = "false";}else{res = "true";};

                var retorno = {  
                    nome:"MEGA-SENA",
                    numero_concurso:html[0],
                    data_concurso:html[11],
                    data_concurso_milliseconds:1562122800000,
                    local_realizacao:html[12],
                    rateio_processamento:false,
                    acumulou:ac,
                    valor_acumulado:html[1],
                    dezenas:dezenas.slice(6, 12),
                    premiacao:[  
                       {  
                          nome:"Sena",
                          quantidade_ganhadores:html[3],
                          valor_total:html[4],
                          acertos:6
                       },
                       {  
                          nome:"Quina",
                          quantidade_ganhadores:html[5],
                          valor_total:html[6],
                          acertos:5
                       },
                       {  
                          nome:"Quadra",
                          quantidade_ganhadores:html[7],
                          valor_total:html[8],
                          acertos:4
                       }
                    ],
                    local_ganhadores:[  
                       {  
                          local:html[14],
                          cidade:html[12],
                          uf:"NEHUM",
                          quantidade_ganhadores:1,
                          canal_eletronico:false
                       }
                    ],
                    arrecadacao_total:html[24],
                    data_proximo_concurso: html[22],
                    data_proximo_concurso_milliseconds:1562382000000,
                    valor_estimado_proximo_concurso:html[21],
                    valor_final_concurso_acumulado:html[18],
                    numero_final_concurso_acumulado:0,
                    valor_acumulado_especial:html[23],
                    nome_acumulado_especial:"Mega da Virada"
                 };
                /*
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
