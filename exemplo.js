const PINO_3 = '1';
const PINO_5 = '2';
const PINO_6 = '3';
const PINO_9 = '4';
const PINO_10 = '5';
const PINO_11 = '6';
const PINO_A0 = '7';
const PINO_A1 = '8';
const PINO_A2 = '9';
const PINO_A3 = 'A';
const PINO_A4 = 'B';
const PINO_A5 = 'C';
const PINOS_ESCRITA = ['PINO_3', 'PINO_5', 'PINO_6', 'PINO_9', 'PINO_10', 'PINO_11'];
const PINOS_LEITURA = ['PINO_A0', 'PINO_A1', 'PINO_A2', 'PINO_A3', 'PINO_A4', 'PINO_A5'];


/* var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var ligar = true;
var dadoRecebido = "";

var arduinoSerialPort = new SerialPort({
  path: 'COM3',
  baudRate: 9600
});

arduinoSerialPort.on("data", function (data) {
  receber(data);
});

arduinoSerialPort.on('open', async () => {
  console.log('Serial Port COM3 is opened.');
  await setTimeout(() => {
  console.log('início');
  enviar();
  }, 2000);
});

arduinoSerialPort.on('error', (err) => {
  console.log('Error: ', err.message);
});

async function enviar(instrucao) {
  await setTimeout(() => {
    arduinoSerialPort.write(instrucao);
    arduinoSerialPort.drain();
    console.log(ligar + " Enviado");
  }, 2000);
}

function receber(data) {
  dadoRecebido += data;
  if(dadoRecebido.length == 3) {
    console.log("Recebido: " + dadoRecebido);
    dadoRecebido = "";
    enviar();
  }
}
*/

//----------------------------------------------------------//
// Código para as instruções e operadores
//----------------------------------------------------------//

const precedencia = ",=+%-*/";
const regExpOps = /([\+\-\%\/\*\=\,\(\)])/;

const operadores = /[^\d()]+|[\d.]+/g;
const numeros = /^[+-]?\d+(\.\d+)?$/;
const espacoEmBranco = / /g;

var executarOperador = {
  "+": soma,
  "-": subtracao,
  "*": multiplicacao,
  "/": divisao,
  "%": modulo,
  "=": atribuicao,
  ",": separador,
};

var listaVariaveis = {};

function verificarOps(op1, op2) {
  if (typeof op1 != 'number')
    throw new Error("Erro Sintático #3: " + op1);
  if (typeof op2 != 'number')
    throw new Error("Erro Sintático #4: " + op2);
}

function soma(op1, op2) {
  verificarOps(op1, op2);
  return op1 + op2;
}

function subtracao(op1, op2) {
  verificarOps(op1, op2);
  return op1 - op2;
}

function multiplicacao(op1, op2) {
  verificarOps(op1, op2);
  return op1 * op2;
}

function divisao(op1, op2) {
  verificarOps(op1, op2);
  return op1 / op2;
}

function modulo(op1, op2) {
  verificarOps(op1, op2);
  return op1 % op2;
}

function atribuicao(op1, op2) {
  listaVariaveis[op1] = op2;
  return op2;
}

function instrucaoArduino(op1, op2) {
  listaVariaveis[op1] = op2;
  return op2;
}

function separador(op1, op2) {
  if (op1 === null || op1 === undefined || op2 === null || op2 === undefined)
    throw new Error("Erro Sintático #6: Uso indevido da vírgula");
  return op1;
}

//----------------------------------------------------------//
// Código para os comandos
//----------------------------------------------------------//

function tratarEnquanto(numLinha, tokens) {
  if (tokens[0] != 'enquanto' || tokens[1] != '(' || tokens[3] != ')')
    throw new Error("Erro Sintático #10: uso indevido do while");
  if (listaVariaveis[tokens[2]] == undefined)
    throw new Error("Erro Sintático #11: while sem variável de condição");
  pilhaEnquanto.push({ 'linha': numLinha, 'variavel': tokens[2] });
  return verificarEnquanto(tokens);
}

function verificarEnquanto(tokens) {
  // Verificando se estamos em um contexto de loop (enquanto)
  let tamPilhaEnquanto = pilhaEnquanto.length;
  if (tamPilhaEnquanto.length > 0) {
    let contexto = pilhaEnquanto[tamPilhaEnquanto - 1];
    if (listaVariaveis[op1] == 0) { // teste do enquanto falhou
      if (tokens.length == 1 && tokens[0] == 'fim_enquanto') {
        pilhaEnquanto.pop();
        return 0;
      }
      return 0;
    }
  }
  return 1;
}

//----------------------------------------------------------//
// Código para as funções nativas
//----------------------------------------------------------//

function trataArduino(tokens) {
  if (tokens[0] != 'arduino' || tokens[1] != '(' || tokens[3] != ',' || tokens[5] != ')')
    throw new Error("Erro Sintático #12: uso indevido da funcao nativa arduino");
  alert(tokens[2]);
  if (tokens[2] != 'PINO3')
    throw new Error("Erro Sintático #13: funcao nativa arduino sem indicar o pino");
  alert(typeof tokens[4]);
  if (listaVariaveis[tokens[4]] == undefined && typeof tokens[4] != 'number')
    throw new Error("Erro Sintático #14: funcao nativa arduino sem indicar o pino");
  return true;
}

//----------------------------------------------------------//

function geraTokens(instrucao) {
  // Retira os espaços em branco
  instrucao = instrucao.replace(/\s+/g, '');
  let tokens = instrucao.split(regExpOps);
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] == "") {
      tokens.splice(i, 1);
      continue;
    }
    let valor = tokens[i].match(numeros);
    if (valor != undefined && valor != null)
      tokens[i] = parseFloat(tokens[i], 10);
  }
  console.log("Tokens", tokens)
  return tokens;
}

//----------------------------------------------------------//

function executar(tokens, linhaAtual) {

  // Verificando se estamos em um contexto de loop (enquanto)
  if (verificarEnquanto(tokens) == 0)
    return 0;

  // Se o array de tokens só tiver um único elemento,
  // esse representa o resultado.
  if (tokens.length == 1) {
    if (typeof tokens[0] != 'number')
      throw new Error("Erro Sintático #1");
    return tokens[0];
  }

  // Esta variável indicará a posição do operador com maior precedência.
  // Ao final, a variável posOpMaiorPrecedencia indicará a posição do 
  // operador com maior precedência.
  let posOpMaiorPrecedencia = -1;

  // Vou percorrer os tokens e descobrir qual é o operador com maior precedência
  for (i = 0; i < tokens.length; i++) {
    // Se o token não é string, é porque representa uma literal numérica
    if (typeof tokens[i] != 'string')
      continue;
    // Se o token é uma string, então ou é um comando, 
    // função arduino nativa ou é um operador.
    let tokenAtual = tokens[i].match(regExpOps);
    // Se não é um operador, então deve ser um comando, funcao nativa ou uma variável
    if (tokenAtual == null) {
      tokenAtual = tokens[i];

      if (tokenAtual == 'enquanto')
        return tratarEnquanto(tokens);
      if (tokenAtual == 'se')
        return tratarSe(tokens);
      /*else if(tokenAtual == 'arduinoEscrita') 
        return trataArduinoEscrita(tokens);             
      else if(tokenAtual == 'arduinoLeitura') 
        return trataArduinoLeitura(tokens);             
      else if(tokenAtual == 'esperar') 
        return trataEsperar(tokens);*/
      else if (listaVariaveis[tokenAtual] != undefined) {
        tokens[i] = listaVariaveis[tokenAtual];
      }
    }
    else { // é um operador
      // Se ainda não defini o operador com maior precedência
      if (posOpMaiorPrecedencia == -1) {
        // Guardo a posição do operador
        posOpMaiorPrecedencia = i;
      }
      else {
        if (precedencia.indexOf(tokens[i]) > precedencia.indexOf(tokens[posOpMaiorPrecedencia])) {
          posOpMaiorPrecedencia = i;
        }
      }
    }
  }

  // Se não encontrei um operador, erro sintático
  if (posOpMaiorPrecedencia < 0 || posOpMaiorPrecedencia == tokens.length - 1)
    throw new Error("Erro Sintático #2");

  // Pego o operador com maior precedência
  let operador = tokens[posOpMaiorPrecedencia];
  let operando1 = tokens[posOpMaiorPrecedencia - 1];
  let operando2 = tokens[posOpMaiorPrecedencia + 1];


  tokens[posOpMaiorPrecedencia] = executarOperador[operador](operando1, operando2);

  // Retiro os operandos da expressão
  tokens.splice(posOpMaiorPrecedencia - 1, 1);
  tokens.splice(posOpMaiorPrecedencia, 1);


  // Solicito que volte a processar a expressão.
  return executar(tokens, linhaAtual);
}

//----------------------------------------------------------//

var tokens;
var linhaAtual = 0;
var pilhaEnquanto = [];
var pilhaSe = [];

function processar(codigo) {
  for (linhaAtual = 0; linhaAtual < codigo.length; linhaAtual++) {
    tokens = geraTokens(codigo[linhaAtual]);
    let resultado = executar(tokens, linhaAtual);
    //console.log(resultado);
  }
}

//----------------------------------------------------------//

var codigo =
  [
    "i = 10, j = 255",
    "i = j * j - 1 ",
    "j = j * 10",
    //"arduinoEscrita(PINO3, 255)",
    //"enquanto(   j)",
    //"    arduinoEscrita(PINO3, j)",
    //"    j = j - 1",
    //"    j = arduinoLeitura(PINOA0)",
    //"fim_enquanto"  
  ];


processar(codigo);



var instrucao = "MOVE A,6";

var regex = /[ ,]/g;

var tokens = instrucao.split(regex);

console.log(JSON.stringify(tokens));


//var tokens = geraTokens(instrucao);

//try {
//  alert("A expressão " + instrucao + " é igual a " + executar(tokens));
//}
//catch(e) {
//  alert(e);
//}