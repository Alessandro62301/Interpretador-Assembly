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
//const regexMn = /([A-Z]+) ([A-Z]),([0-9-A-Z]?[0-9-A-Z])/; NAO MUDAR NADA AQUI
const regexMn = /([A-Z]+) ([A-Z]),(([0-9-A-Z]?[0-9-A-Z]))?( [a-z]+)?/;
//const regexLb = /([a-z]+:)/; NAO MUDAR NADA AQUI
const regexLb = /([a-z]+:)/;
//const regexLbFinal = /( [a-z]+)/; NAO MUDAR NADA AQUI
const regexLbFinal = /([J-U]+) ([a-z]+)/;

let pc = 0;
let label = '';
let labelKeys = [];
let linhaVr = [];
let labelTmp = '';

codigo2 = [
  'MOVE A,15',
  'MOVE B,5',
  'enquanto: SUBT A,1',// codigo quebrado
  'SUBT A,1',// codigo quebrado
  'ADD A,1',
  'MOVE B,A',
  'CMP B,50',
  'JTRUE B, fim',
  'MOVE B,A',
  'MOVE B,C',
  'MULT A,B',
  'SUBT B,1',
  'JUMP enquanto',
  'fim: HALT',
]

codigo = [
  'MOVE A,7  --mamam',
  'MOVE B,6',
  'enquanto: MOVE C,B',
  'MOVE C,B',
  'CMP B,1',
  'JTRUE B, fim',
  'MOVE B,C',
  'MULT A,B',
  'SUBT B,1',
  'JUMP enquanto',
  'fim: HALT'
]

function geraTokens(linha) {
  verifyLabel(linha);
  if (verifyFinal(linha) == true) return;

  let teste = linha;

  linha = linha.match(regexMn);

  if (verifyJump(teste)) {
    return;
  } else {

    console.log(linha)

    if (linha[1] == 'MOVE') atribuirValor(linha);

    if (linha[1] == 'ADD') soma(linha);

    if (linha[1] == 'SUBT') subt(linha);

    if (linha[1] == 'MULT') mult(linha);

    if (linha[1] == 'CMP') verifyCmp(linha)

    if (linha[1] == 'JTRUE' || linha[1] == 'JFALSE') verifyBoolean(linha)


  }

}

function verifyCmp(instrucao) {
  // CMP   B, 1
  //JTRUE B, fim
  console.log('instrucao Cmp', instrucao)
  if (registrador[instrucao[2]] == +instrucao[3]) {
    console.log('CMP = TRUE' + registrador[instrucao[2]] + 'e igual a' + instrucao[3])
    registrador[instrucao[2]] = 1;
    return true;
  } else {
    console.log('CMP = TRUE' + registrador[instrucao[2]] + 'e diferente de' + instrucao[3])
    registrador[instrucao[2]] = 0;
    console.log('CMP = FALSE')
    return false;
  }
}

function verifyBoolean(instrucao) {
  let nameLabel = instrucao[5].replace(' ', '') + ':'
  //  console.log(' Instrucao =',instrucao)
  // console.log('Label Instrucao =',nameLabel)
  // console.log('Mn Instrucao =',instrucao[1])
  // console.log('Mn =',instrucao[2])
  // console.log('Registrador',registrador[instrucao[2]])

  if (instrucao[1] == "JTRUE") {
    if (registrador[instrucao[2]] != 0) {
      console.log('JTRUE', registrador[instrucao[2]]);
      jump(nameLabel);
    }
    return;
  }
  if (instrucao[1] == "JFALSE") {
    if (registrador[instrucao[2]] == 0) {
      console.log('JFALSE', instrucao[5]);
      jump(nameLabel);
    }
    return;
  }
  pc++;
}

function verifyLabel(linha) {
  let index = 2;
  let rgxteste = /([J-U]+) ([a-z]+)/;

  label = linha.match(regexLb);

  if (label != null) {
    if (label[1] == 'JTRUE' || label[1] == 'JFALSE') {
      rgxteste = /([A-Z]+) ([A-Z]),(([0-9-A-Z]?[0-9-A-Z]))? ([a-z]+)?/;
      index = 5;
    }
    for (let j = 0; j < codigo.length; j++) {

      linhaVr = codigo[j].match(rgxteste);
      if (linhaVr != null) {
        if (label[0] == (linhaVr[index].replace(' ', '') + ':')) {
          labelKeys.push({ name: label[0], go: pc })
          return true;
        }
      }
    }
  }
  return false;
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

function verifyFinal(linha) {
  let test = linha.match(regexLb);

  if (test == null) {
    linha = linha.match(/([A-Z][A-Z][A-Z]?[A-Z])/);
    if (linha[1] == 'HALT') {
      console.log('Final do Processo!')
      return true;
    }
  }
  return false;
}

function verifyJump(linha) {
  linha = linha.match(regexLbFinal);
  if (linha == null) return false;

  if (linha[1] == 'JUMP') {
    jump(linha[2].replace(' ', '') + ':')
    return true;
  } else {
    return false;
  }
}

function jump(labelName) {
  //console.log('lb',labelKeys.find(element => element.name == label))
  console.log('Label', labelKeys)
  let lb = labelKeys.find(element => element.name == labelName)
  if (lb) {
    console.log('Fui da linha', pc, 'Fui para linha', lb.go)
    pc = lb.go; //lb.go
    return true;

  }
  return false;
}

function processar(codigo) {

  labelKeys.push({ name: 'fim:', go: codigo.length - 1 })

  for (pc = 0; pc < codigo.length; pc++) {
    let stop = verifyFinal(codigo[pc]);
    if (stop == false) {
      geraTokens(codigo[pc]);
      console.log(pc)
    } else {
      break;
    }
  }
  console.log(`A = ${registrador.A} , B = ${registrador.B} , C = ${registrador.C}`)
  console.log('Labels', labelKeys)
}

window.addEventListener('load', function() {
  processar(codigo);
})