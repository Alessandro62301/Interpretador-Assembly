// [<label>:]   <MNEMÔNICO>  [<PARAM1>,<PARAM2>] [-- comentário]

const registradores = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

let registrador = {
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
  G: 0,
  H: 0
}



const mnemonicos = ['MOVE', 'ADD', 'SUBT', 'MULT', 'DIV', 'CMP', 'JUMP', 'JTRUE', 'JFALSE', 'HALT'];
const regexMn = /([A-Z]+) ([A-Z]),([0-9-A-Z]?[0-9-A-Z])/;
const regexLb = /([a-z]+:)/;
const regexLbFinal = /( [a-z]+)/;

let pc = 0;
let label = '';
let labelKeys = [];
let linhaVr = [];
let labelTmp = '';

codigo = [
  'MOVE A,6',
  'enquanto: MOVE B,5',
  'MOVE A,20',
  'CPM A,B',
  'ADD A,20',
  'SUBT A,2',
  'MULT C,8 enquanto',
  'HALT'
]

function verificarMnemonicos(mn) {
  console.log(mn)
}

function geraTokens(linha) {
  verifyLabel(linha);
  let teste;

  if (linha[1] == 'HALT') {
    console.log('Processo Encerrado');

    return false;
  }


  teste = linha.match(regexLbFinal);


  if (teste) {
    labelTmp = teste[0].replace(' ', '') + ':';
    let lb = labelKeys.find(element => element.name == labelTmp)

    if (false) {
      pc = lb.go;
      console.log(pc)
      return true;
    }
  }

  linha = linha.match(regexMn);
  console.log(linha)


  if (linha[1] == 'MOVE') atribuirValor(linha);

  if (linha[1] == 'ADD') soma(linha);

  if (linha[1] == 'SUBT') subt(linha);

  if (linha[1] == 'MULT') mult(linha);


  //console.log("Tokens", linha)
  //return tokens;
}


function verifyLabel(linha) {
  label = linha.match(regexLb);
  if (label) {

    for (let j = 0; j < codigo.length; j++) {

      linhaVr = codigo[j].match(regexLbFinal);
      if (linhaVr != null) {
        if (label[0] == (linhaVr[0].replace(' ', '')) + ':') {

          labelKeys.push({ name: label[0], go: pc })
          return j;
        }
      }
    }
  }
}

function atribuirValor(instrucao) {

  if (!isNaN(instrucao[3])) {
    registrador[instrucao[2]] = +instrucao[3];
  } else {
    registrador[instrucao[2]] = registrador[instrucao[3]];
  }
}

function soma(instrucao) {

  if (!isNaN(instrucao[3])) {
    registrador[instrucao[2]] += +instrucao[3];
  } else {
    registrador[instrucao[2]] += registrador[instrucao[3]];
  }
}

function subt(instrucao) {

  if (!isNaN(instrucao[3])) {
    registrador[instrucao[2]] = registrador[instrucao[2]] - +instrucao[3];
  } else {
    registrador[instrucao[2]] -= registrador[instrucao[2]] - registrador[instrucao[3]];
  }
}
function mult(instrucao) {

  if (!isNaN(instrucao[3])) {
    registrador[instrucao[2]] = registrador[instrucao[2]] * +instrucao[3];
  } else {
    registrador[instrucao[2]] = registrador[instrucao[2]] * registrador[instrucao[3]];
  }
}

function processar(codigo) {
  for (pc = 0; pc < codigo.length; pc++) {
    geraTokens(codigo[pc])
    //tokens = geraTokens(codigo[pc]);
    //let resultado = executar(tokens, pc);
    //console.log(resultado);
  }
  console.log(`A = ${registrador.A} , B = ${registrador.B} , C = ${registrador.C} , H = ${registrador.H}`)
  console.log('Label ', labelKeys)
}

window.addEventListener('load', function() {
  processar(codigo);
})