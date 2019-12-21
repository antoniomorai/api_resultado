'use strict';

var express = require('express'),
    router  = express.Router();


var DuplasenaController = require('../controllers/DuplasenaController');        //http://www1.caixa.gov.br/loterias/loterias/duplasena/duplasena_pesquisa_new.asp
var FederalController = require('../controllers/FederalController');            //http://www1.caixa.gov.br/loterias/loterias/federal/federal_pesquisa.asp
var LotofacilController = require('../controllers/LotofacilController');        //http://www1.caixa.gov.br/loterias/loterias/lotofacil/lotofacil_pesquisa_new.asp
var LotomaniaController = require('../controllers/LotomaniaController');        //http://www1.caixa.gov.br/loterias/loterias/lotomania/_lotomania_pesquisa.asp
var MegasenaController = require('../controllers/MegasenaController');          //http://www1.caixa.gov.br/loterias/loterias/megasena/megasena_pesquisa_new.asp
var QuinaController = require('../controllers/QuinaController');                //http://www1.caixa.gov.br/loterias/loterias/quina/quina_pesquisa_new.asp
var TimemaniaController = require('../controllers/TimemaniaController');        //http://www1.caixa.gov.br/loterias/loterias/timemania/timemania_pesquisa.asp


     
router.get('/', function(req, res, next) {
  res.send('Rodando');
});

//DUPLASENA
router.get('/duplasena', DuplasenaController.ultimoResultado);
router.get('/duplasena/:concurso', DuplasenaController.resultadoDoConcurso);

//FEDERAL
router.get('/federal', FederalController.ultimoResultado);
router.get('/federal/:concurso', FederalController.resultadoDoConcurso);

//LOTOFACIL
router.get('/lotofacil', LotofacilController.ultimoResultado);
router.get('/lotofacil/:concurso', LotofacilController.resultadoDoConcurso);

//LOTOMANIA
router.get('/lotomania', LotomaniaController.ultimoResultado);
router.get('/lotomania/:concurso', LotomaniaController.resultadoDoConcurso);


//MEGASENA
router.get('/megasena', MegasenaController.ultimoResultado);
router.get('/megasena/:concurso', MegasenaController.resultadoDoConcurso);

//QUINA
router.get('/quina', QuinaController.ultimoResultado);
router.get('/quina/:concurso', QuinaController.resultadoDoConcurso);

//TIMEMANIA
router.get('/timemania', TimemaniaController.ultimoResultado);
router.get('/timemania/:concurso', TimemaniaController.resultadoDoConcurso);

module.exports = router;
