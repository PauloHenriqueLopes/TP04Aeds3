let profundidadeGlobal = 1;
let bucketSize = parseInt(document.getElementById("bucketSize").value);
let bucketSizeLocked = false;
let diretorio = [];
let buckets = [];

class Bucket {
  constructor(id, pl) {
    this.id = id;
    this.chaves = [];
    this.pl = pl;
  }

  cheio() {
    return this.chaves.length >= bucketSize;
  }

  inserir(chave) {
    this.chaves.push(chave);
  }

  removerTodos() {
    const temp = [...this.chaves];
    this.chaves = [];
    return temp;
  }
}

function hashBinario(chave) {
  return (chave % (1 << profundidadeGlobal)).toString(2).padStart(profundidadeGlobal, '0');
}

function atualizarVisuais() {
  const dirDiv = document.getElementById("diretorio");
  const buckDiv = document.getElementById("buckets");

  dirDiv.innerHTML = `<h3>Diretório</h3><h2>P = ${profundidadeGlobal}</h2>`;
  
  diretorio.forEach((b, i) => {
    const bin = i.toString(2).padStart(profundidadeGlobal, '0');
    dirDiv.innerHTML += `<div class="diretorio-item">${bin} → Bucket ${b.id}</div>`;
  });

  buckDiv.innerHTML = `<h3>Buckets</h3>`;
  const idsUsados = new Set();
  buckets.forEach(b => {
    if (!idsUsados.has(b.id)) {
      idsUsados.add(b.id);
      let chaves = b.chaves.length ? b.chaves.join(' ') : "<i>vazio</i>";
      buckDiv.innerHTML += `
        <div class="bucket-item">
          <strong>Bucket ${b.id} (PL: ${b.pl})</strong>
          <div class="bucket-content">${chaves}</div>
        </div>`;
    }
  });
}

function inserirChave() {
  const chave = parseInt(document.getElementById("inputKey").value);
  if (isNaN(chave)) return;

  if (!bucketSizeLocked) {
    bucketSize = parseInt(document.getElementById("bucketSize").value);
    bucketSizeLocked = true;
    document.getElementById("bucketSize").disabled = true;
  }

  log(`->Inserindo chave ${chave}.`);
  let bin = hashBinario(chave);
  log(`Hash binário de ${chave} com profundidade ${profundidadeGlobal} é ${bin}.`); // LOG ADICIONADO
  let idx = parseInt(bin, 2);
  let bucket = diretorio[idx];

  log(`Chave será direcionada ao índice ${idx}, apontando para o bucket ${bucket.id}.`); // LOG ADICIONADO

  if (bucket.cheio()) {
    log(`Bucket ${bucket.id} está cheio. Iniciando processo de split...`); // LOG ADICIONADO

    if (bucket.pl === profundidadeGlobal) {
      profundidadeGlobal++;
      duplicarDiretorio();
      log(`Profundidade local do bucket (${bucket.pl}) igual à profundidade global. Diretório duplicado para profundidade global ${profundidadeGlobal}.`); // LOG ADICIONADO
    }

    const novoBucket = new Bucket(buckets.length, bucket.pl + 1);
    buckets.push(novoBucket);
    const oldId = bucket.id;

    log(`Novo bucket ${novoBucket.id} criado com profundidade local ${novoBucket.pl}.`); // LOG ADICIONADO

    diretorio.forEach((b, i) => {
      if (b.id === oldId) {
        const bin = i.toString(2).padStart(profundidadeGlobal, '0');
        if (bin[bin.length - (bucket.pl + 1)] === '1') {
          diretorio[i] = novoBucket;
          log(`Ponteiro ${bin} redirecionado do bucket ${oldId} para o novo bucket ${novoBucket.id}.`); // LOG ADICIONADO
        }
      }
    });

    const chaves = bucket.removerTodos();
    log(`Bucket ${oldId} esvaziado. Chaves removidas: ${chaves.join(", ")}`); // LOG ADICIONADO
    bucket.pl++;

    for (const c of chaves) {
      log(`Reposicionando chave ${c} após split...`); // LOG ADICIONADO
      inserirNovaChave(c);
    }

    log(`Bucket ${oldId} dividido com sucesso. Inserindo novamente a chave ${chave}.`); // LOG ADICIONADO
    inserirNovaChave(chave);
  } else {
    log(`Bucket ${bucket.id} ainda tem espaço. Inserindo chave diretamente.`); // LOG ADICIONADO
    inserirNovaChave(chave);
  }

  atualizarVisuais();
  document.getElementById("inputKey").value = "";
}

function inserirNovaChave(chave) {
  const bin = hashBinario(chave);
  const idx = parseInt(bin, 2);
  let bucket = diretorio[idx];

  log(`Tentando inserir chave ${chave} no índice ${idx} (bin: ${bin}) → Bucket ${bucket.id}`); // LOG ADICIONADO

  if (!bucket.cheio()) {
    bucket.inserir(chave);
    log(`Chave ${chave} inserida com sucesso no bucket ${bucket.id}.`); // LOG ADICIONADO
    return;
  }

  log(`Bucket ${bucket.id} está cheio ao tentar inserir chave ${chave}. Iniciando novo split.`); // LOG ADICIONADO

  if (bucket.pl === profundidadeGlobal) {
    profundidadeGlobal++;
    duplicarDiretorio();
    log(`Profundidade global aumentada para ${profundidadeGlobal} após split.`); // LOG ADICIONADO
  }

  const novoBucket = new Bucket(buckets.length, bucket.pl + 1);
  buckets.push(novoBucket);
  const antigoId = bucket.id;

  log(`Novo bucket ${novoBucket.id} criado com profundidade local ${novoBucket.pl}. Atualizando ponteiros do diretório...`); // LOG ADICIONADO

  for (let i = 0; i < diretorio.length; i++) {
    const bin = i.toString(2).padStart(profundidadeGlobal, '0');
    const prefixo = bin.substring(0, bucket.pl);
    const bitCritico = bin[bucket.pl];

    if (diretorio[i].id === antigoId) {
      if (bitCritico === '0') {
        diretorio[i] = bucket;
      } else {
        diretorio[i] = novoBucket;
      }
      log(`Ponteiro ${bin} agora aponta para bucket ${diretorio[i].id}.`); // LOG ADICIONADO
    }
  }

  bucket.pl++;
  log(`Profundidade local do bucket ${bucket.id} aumentada para ${bucket.pl}.`); // LOG ADICIONADO

  const chaves = bucket.removerTodos();
  log(`Redistribuindo chaves do bucket ${antigoId}: ${chaves.join(", ")}`); // LOG ADICIONADO

  for (const c of chaves) {
    const novoBin = hashBinario(c);
    const novoIdx = parseInt(novoBin, 2);
    diretorio[novoIdx].inserir(c);
    log(`Chave ${c} inserida no bucket ${diretorio[novoIdx].id} após redistribuição.`); // LOG ADICIONADO
  }

  log(`Bucket ${antigoId} dividido. Novo bucket ${novoBucket.id} criado.`); // LOG ADICIONADO

  const finalBin = hashBinario(chave);
  const finalIdx = parseInt(finalBin, 2);
  diretorio[finalIdx].inserir(chave);
  log(`Chave ${chave} inserida no bucket ${diretorio[finalIdx].id} após redistribuição.`); // LOG ADICIONADO
}


function duplicarDiretorio() {
  const tamanhoAtual = diretorio.length;
  for (let i = 0; i < tamanhoAtual; i++) {
    diretorio.push(diretorio[i]);
  }
}

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.value += msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
}

function inicializar() {
  profundidadeGlobal = 1;
  buckets = [];

  const b0 = new Bucket(0, 1);
  const b1 = new Bucket(1, 1);
  buckets.push(b0, b1);

  diretorio = [b0, b1];

  atualizarVisuais();
}

function lockBucketSize() {
  if (bucketSizeLocked) {
    document.getElementById("bucketSize").disabled = true;
  }
}

window.onload = () => {
  inicializar();
};
