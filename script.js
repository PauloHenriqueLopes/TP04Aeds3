let profundidadeGlobal = 1;
let bucketSize = parseInt(document.getElementById("bucketSize").value);
let bucketSizeLocked = false;
let diretorio = [];
let buckets = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

function toggleBotoes(disabled) {
  document.querySelectorAll("button").forEach(btn => btn.disabled = disabled);
}


function hashBinario(chave) {
  return (chave % (1 << profundidadeGlobal)).toString(2).padStart(profundidadeGlobal, '0');
}

function atualizarVisuais() {
  const dirDiv = document.getElementById("diretorio");
  const buckDiv = document.getElementById("buckets");

  dirDiv.innerHTML = `<h3>Diretório</h3><h2>P = ${profundidadeGlobal}</h2>`;
  
  diretorio.forEach((b, i) => {
    dirDiv.innerHTML += `<div class="diretorio-item">${i} → Bucket ${b.id}</div>`;
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

async function inserirChave() {
  toggleBotoes(true);
  const chave = parseInt(document.getElementById("inputKey").value);
  if (isNaN(chave)) return;

  if (!bucketSizeLocked) {
    bucketSize = parseInt(document.getElementById("bucketSize").value);
    bucketSizeLocked = true;
    document.getElementById("bucketSize").disabled = true;
  }

  await log(`\n-> Inserindo chave ${chave}.`);
  let idx = chave % (1 << profundidadeGlobal);
  let bucket = diretorio[idx];

  await log(`Hash de ${chave} com profundidade ${profundidadeGlobal} resulta no índice ${idx}.`);
  await log(`Chave será direcionada ao índice ${idx}, que aponta para o bucket ${bucket.id}.`);

  if (bucket.cheio()) {
    await log(`Bucket ${bucket.id} está cheio. Iniciando processo de split...`);

    if (bucket.pl === profundidadeGlobal) {
      profundidadeGlobal++;
      duplicarDiretorio();
      await log(`Profundidade local do bucket (${bucket.pl}) igual à profundidade global. Diretório duplicado para profundidade global ${profundidadeGlobal}.`);
    }

    const novoBucket = new Bucket(buckets.length, bucket.pl + 1);
    buckets.push(novoBucket);
    const oldId = bucket.id;

    await log(`Novo bucket ${novoBucket.id} criado com profundidade local ${novoBucket.pl}.`);

    for (let i = 0; i < diretorio.length; i++) {
      if (diretorio[i].id === oldId) {
        const bin = i.toString(2).padStart(profundidadeGlobal, '0');
        if (bin[bin.length - (bucket.pl + 1)] === '1') {
          diretorio[i] = novoBucket;
          await log(`Ponteiro ${i} redirecionado do bucket ${oldId} para o novo bucket ${novoBucket.id}.`);
        }
      }
    }

    const chaves = bucket.removerTodos();
    await log(`Bucket ${oldId} esvaziado. Chaves removidas: ${chaves.join(", ")}`);
    bucket.pl++;

    for (const c of chaves) {
      await log(`Reposicionando chave ${c} após split...`);
      await inserirNovaChave(c);
    }

    await log(`Bucket ${oldId} dividido com sucesso. Inserindo novamente a chave ${chave}.`);
    await inserirNovaChave(chave);
  } else {
    await log(`Bucket ${bucket.id} ainda tem espaço. Inserindo chave diretamente.`);
    await inserirNovaChave(chave);
  }

  atualizarVisuais();
  toggleBotoes(false);
  document.getElementById("inputKey").value = "";
}

async function inserirNovaChave(chave) {
  const idx = chave % (1 << profundidadeGlobal);
  let bucket = diretorio[idx];

  await log(`Tentando inserir chave ${chave} no índice ${idx} → Bucket ${bucket.id}`);

  if (!bucket.cheio()) {
    bucket.inserir(chave);
    await log(`Chave ${chave} inserida com sucesso no bucket ${bucket.id}.`);
    atualizarVisuais();
    await sleep(2200);
    return;
  }

  await log(`Bucket ${bucket.id} está cheio ao tentar inserir chave ${chave}. Iniciando novo split.`);

  if (bucket.pl === profundidadeGlobal) {
    profundidadeGlobal++;
    duplicarDiretorio();
    await log(`Profundidade global aumentada para ${profundidadeGlobal} após split.`);
  }

  const novoBucket = new Bucket(buckets.length, bucket.pl + 1);
  buckets.push(novoBucket);
  const antigoId = bucket.id;

  await log(`Novo bucket ${novoBucket.id} criado com profundidade local ${novoBucket.pl}. Atualizando ponteiros do diretório...`);

  for (let i = 0; i < diretorio.length; i++) {
    const bin = i.toString(2).padStart(profundidadeGlobal, '0');
    const bitCritico = bin[bucket.pl];

    if (diretorio[i].id === antigoId) {
      if (bitCritico === '0') {
        diretorio[i] = bucket;
      } else {
        diretorio[i] = novoBucket;
      }
      await log(`Ponteiro ${i} agora aponta para bucket ${diretorio[i].id}.`);
    }
  }

  bucket.pl++;
  await log(`Profundidade local do bucket ${bucket.id} aumentada para ${bucket.pl}.`);

  const chaves = bucket.removerTodos();
  await log(`Redistribuindo chaves do bucket ${antigoId}: ${chaves.join(", ")}`);

  for (const c of chaves) {
    const novoIdx = c % (1 << profundidadeGlobal);
    diretorio[novoIdx].inserir(c);
    await log(`Chave ${c} inserida no bucket ${diretorio[novoIdx].id} após redistribuição.`);
    atualizarVisuais();
    await sleep(2200);
  }

  await log(`Bucket ${antigoId} dividido. Novo bucket ${novoBucket.id} criado.`);

  const finalIdx = chave % (1 << profundidadeGlobal);
  diretorio[finalIdx].inserir(chave);
  await log(`Chave ${chave} inserida no bucket ${diretorio[finalIdx].id} após redistribuição.`);
  atualizarVisuais();
  await sleep(2200);
}

function duplicarDiretorio() {
  const tamanhoAtual = diretorio.length;
  for (let i = 0; i < tamanhoAtual; i++) {
    diretorio.push(diretorio[i]);
  }
}

async function buscarChave() {
  toggleBotoes(true);
  const chave = parseInt(document.getElementById("inputKey").value);
  if (isNaN(chave)) return;

  await log(`\n-> Buscando chave ${chave}...`);

  const idx = chave % (1 << profundidadeGlobal);
  const bucket = diretorio[idx];

  await log(`Hash de ${chave} com profundidade ${profundidadeGlobal} resulta no índice ${idx}.`);
  await log(`Verificando no índice ${idx}, que aponta para o bucket ${bucket.id}.`);
  await sleep(2200);

  const chavesBucket = bucket.chaves.join(", ") || "vazio";
  await log(`Bucket ${bucket.id} contém as chaves: ${chavesBucket}.`);
  await sleep(2200);

  if (bucket.chaves.includes(chave)) {
    await log(`✅ Chave ${chave} encontrada no bucket ${bucket.id}.`);
  } else {
    await log(`❌ Chave ${chave} não encontrada no bucket ${bucket.id}.`);
  }

  toggleBotoes(false);
  document.getElementById("inputKey").value = "";
}

function limparTabela() {
  bucketSizeLocked = false;
  document.getElementById("bucketSize").disabled = false;
  document.getElementById("log").value = "";

  inicializar();
}

async function log(msg, delay = 2200) {
  const logBox = document.getElementById("log");
  logBox.value += msg + "\n";
  logBox.scrollTop = logBox.scrollHeight;
  await sleep(delay); 
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
