document.addEventListener('DOMContentLoaded', () => {

    // VARIÁVEIS GLOBAIS
    let historicoPartidas = [];
    let graficoDistribuicao, graficoResultados, graficoProbTempo; 
    
    // Elementos DOM
    const dom = {
        nDados: document.getElementById('num-dados'),
        tipoDado: document.getElementById('tipo-dado'),
        nSimulacoes: document.getElementById('num-simulacoes'),
        btnJogar: document.getElementById('btn-jogar'),
        btnSimular: document.getElementById('btn-simular'),
        somaRobo: document.getElementById('soma-robo'),
        rolagensRobo: document.getElementById('rolagens-robo'),
        somaHumano: document.getElementById('soma-humano'),
        rolagensHumano: document.getElementById('rolagens-humano'),
        resultadoTxt: document.getElementById('resultado-rodada'),
        comentarioRobo: document.getElementById('comentario-robo'),
        totalPartidas: document.getElementById('total-partidas'),
        
        probVitoria: document.getElementById('prob-vitoria'),
        probDerrota: document.getElementById('prob-derrota'),
        probEmpate: document.getElementById('prob-empate'),
        mediaHumano: document.getElementById('media-humano'),
        mediaRobo: document.getElementById('media-robo'),
        
        selCond: document.getElementById('select-prob-condicional'),
        resCond: document.getElementById('resultado-prob-condicional'),
        
        infoIcon: document.getElementById('info-monte-carlo'),
        modalOverlay: document.getElementById('modal-overlay'),
        modalBox: document.getElementById('modal-monte-carlo'),
        modalClose: document.getElementById('modal-close-btn')
    };
    
    const ctxDist = document.getElementById('grafico-distribuicao').getContext('2d');
    const ctxRes = document.getElementById('grafico-resultados').getContext('2d');
    const ctxTime = document.getElementById('grafico-probabilidade-tempo').getContext('2d'); 
    
    const frases = {
        vitoria: ["Impossível... Meus cálculos!", "Sorte de principiante, humano.", "Detectei uma falha na Matrix."],
        derrota: ["A estatística nunca falha.", "Como previsto pelos meus algoritmos.", "Vitória da máquina. Novamente."],
        empate: ["Um equilíbrio perfeito.", "Nossos processadores pensam igual."]
    };
    
    const calcMedia = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const calcVar = (arr, med) => arr.length < 2 ? 0 : arr.map(v => (v - med) ** 2).reduce((a, b) => a + b, 0) / arr.length;
    const calcDP = v => Math.sqrt(v);

    function calcFreq(arr, min, max) {
        const freqs = new Array(max - min + 1).fill(0);
        for (const v of arr) if (v >= min && v <= max) freqs[v - min]++;
        return freqs;
    }

    function calcDistTeorica(n, lados) {
        const maxSoma = n * lados;
        let dp = Array(n + 1).fill(0).map(() => Array(maxSoma + 1).fill(0));
        dp[0][0] = 1;
        for (let i = 1; i <= n; i++) {
            for (let j = i; j <= i * lados; j++) {
                for (let k = 1; k <= lados; k++) {
                    if (j - k >= 0) dp[i][j] += dp[i - 1][j - k];
                }
            }
        }
        const total = Math.pow(lados, n);
        const probs = [];
        for (let s = n; s <= maxSoma; s++) probs.push(dp[n][s] / total);
        return probs;
    }

    function rolar(n, lados) {
        let rolagens = [];
        let soma = 0;
        for (let i = 0; i < n; i++) {
            const r = Math.floor(Math.random() * lados) + 1;
            rolagens.push(r);
            soma += r;
        }
        return { soma, rolagens };
    }

    function jogar() {
        const n = parseInt(dom.nDados.value) || 1;
        const lados = parseInt(dom.tipoDado.value) || 6;
        
        const robo = rolar(n, lados);
        const humano = rolar(n, lados);
        
        let res = "empate";
        if (humano.soma > robo.soma) res = "vitoria";
        else if (humano.soma < robo.soma) res = "derrota";
        
        dom.resultadoTxt.className = `status-text ${res}`;
        dom.resultadoTxt.innerText = res === "vitoria" ? "VOCÊ VENCEU!" : res === "derrota" ? "ROBÔ VENCEU" : "EMPATE";
        
        dom.somaRobo.innerText = robo.soma;
        dom.rolagensRobo.innerText = `(${robo.rolagens.join(',')})`;
        dom.somaHumano.innerText = humano.soma;
        dom.rolagensHumano.innerText = `(${humano.rolagens.join(',')})`;
        dom.comentarioRobo.innerText = frases[res][Math.floor(Math.random() * frases[res].length)];
        historicoPartidas.push({ soma_robo: robo.soma, soma_humano: humano.soma, resultado: res });
        atualizarRelatorio();
    }

    function simular() {
        const n = parseInt(dom.nDados.value) || 1;
        const lados = parseInt(dom.tipoDado.value) || 6;
        const qtd = parseInt(dom.nSimulacoes.value) || 1000;

        dom.comentarioRobo.innerText = "Processando dados...";
        graficoProbTempo.data.labels = [];
        graficoProbTempo.data.datasets.forEach(d => d.data = []);

        let v=0, d=0, e=0;
        historicoPartidas.forEach(r => { if(r.resultado==='vitoria')v++; else if(r.resultado==='derrota')d++; else e++; });
        
        const totalInicial = historicoPartidas.length;

        for(let i=0; i<qtd; i++) {
            const r = rolar(n, lados);
            const h = rolar(n, lados);
            let res = "empate";
            if (h.soma > r.soma) { res="vitoria"; v++; }
            else if (h.soma < r.soma) { res="derrota"; d++; }
            else { e++; }

            historicoPartidas.push({ soma_robo: r.soma, soma_humano: h.soma, resultado: res });
            
            const totalAtual = totalInicial + i + 1;
            const sampleRate = Math.max(1, Math.floor(qtd / 50)); 
            
            if ((i+1) % sampleRate === 0 || i === qtd-1) {
                graficoProbTempo.data.labels.push(totalAtual);
                graficoProbTempo.data.datasets[0].data.push((v/totalAtual)*100);
                graficoProbTempo.data.datasets[1].data.push((d/totalAtual)*100);
                graficoProbTempo.data.datasets[2].data.push((e/totalAtual)*100);
            }
        }
        
        graficoProbTempo.update();
        dom.resultadoTxt.innerText = `${qtd} simulações concluídas.`;
        dom.resultadoTxt.className = 'status-text info';
        atualizarRelatorio();
    }

    function atualizarRelatorio() {
        const total = historicoPartidas.length;
        const n = parseInt(dom.nDados.value);
        const lados = parseInt(dom.tipoDado.value);
        const min = n;
        const max = n * lados;

        if (total === 0) {
            atualizarGraficos(min, max, 0,0,0, [], [], n, lados);
            return;
        }

        const somasH = historicoPartidas.map(r => r.soma_humano);
        const somasR = historicoPartidas.map(r => r.soma_robo);
        const res = historicoPartidas.map(r => r.resultado);

        const v = res.filter(r => r === 'vitoria').length;
        const d = res.filter(r => r === 'derrota').length;
        const e = res.filter(r => r === 'empate').length;

        dom.totalPartidas.innerText = `${total} partidas`;
        dom.probVitoria.innerText = `${((v/total)*100).toFixed(1)}%`;
        dom.probDerrota.innerText = `${((d/total)*100).toFixed(1)}%`;
        dom.probEmpate.innerText = `${((e/total)*100).toFixed(1)}%`;

        dom.mediaHumano.innerText = calcMedia(somasH).toFixed(2);
        dom.mediaRobo.innerText = calcMedia(somasR).toFixed(2);
        
        const prevSel = dom.selCond.value;
        dom.selCond.innerHTML = '';
        for(let s=min; s<=max; s++) {
            let opt = document.createElement('option');
            opt.value = s;
            opt.innerText = s;
            dom.selCond.appendChild(opt);
        }
        if(prevSel) dom.selCond.value = prevSel;
        calcCondicional();

        atualizarGraficos(min, max, v, d, e, somasH, somasR, n, lados);
    }

    function calcCondicional() {
        const target = parseInt(dom.selCond.value);
        if(isNaN(target) || !historicoPartidas.length) {
            dom.resCond.innerText = "--"; return;
        }
        const subset = historicoPartidas.filter(r => r.soma_robo === target);
        if(!subset.length) {
            dom.resCond.innerText = "0 ocorrências"; return;
        }
        const wins = subset.filter(r => r.resultado === 'vitoria').length;
        dom.resCond.innerText = `${((wins/subset.length)*100).toFixed(1)}%`;
    }

    function reset() {
        historicoPartidas = [];
        dom.somaRobo.innerText = "--"; dom.rolagensRobo.innerText = "";
        dom.somaHumano.innerText = "--"; dom.rolagensHumano.innerText = "";
        dom.resultadoTxt.innerText = "Pronto para jogar";
        dom.resultadoTxt.className = 'status-text';
        dom.comentarioRobo.innerText = "";
        
        dom.totalPartidas.innerText = "0 partidas";
        dom.probVitoria.innerText = "--";
        dom.probDerrota.innerText = "--";
        dom.probEmpate.innerText = "--";
        dom.mediaHumano.innerText = "--";
        dom.mediaRobo.innerText = "--";
        
        if(graficoDistribuicao) { graficoDistribuicao.destroy(); graficoResultados.destroy(); graficoProbTempo.destroy(); }
        initGraficos();
        
        const n = parseInt(dom.nDados.value);
        const lados = parseInt(dom.tipoDado.value);
        atualizarGraficos(n, n*lados, 0,0,0, [], [], n, lados);
    }

    function initGraficos() {        
        graficoDistribuicao = new Chart(ctxDist, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    { label: 'Teórica', type: 'line', borderColor: '#ffab00', backgroundColor: 'rgba(255, 171, 0, 0.2)', borderWidth: 3, pointRadius: 0, tension: 0.4, fill: true, order: 1 },
                    { label: 'Você', backgroundColor: 'rgba(98, 0, 234, 0.6)', borderRadius: 4, order: 2, data: [] },
                    { label: 'Robô', backgroundColor: 'rgba(156, 163, 175, 0.5)', borderRadius: 4, order: 3, data: [] }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { x: { grid: { display: false } }, y: { grid: { color: '#f3f4f6' } } }
            }
        });

        graficoResultados = new Chart(ctxRes, {
            type: 'doughnut', 
            data: {
                labels: ['Vitórias', 'Derrotas', 'Empates'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#10b981', '#ef4444', '#9ca3af'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });

        // --- AQUI ESTÁ A CORREÇÃO DO EIXO X ---
        graficoProbTempo = new Chart(ctxTime, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    { label: 'Vit', borderColor: '#10b981', pointRadius: 0, borderWidth: 2, tension: 0.1, data: [] },
                    { label: 'Der', borderColor: '#ef4444', pointRadius: 0, borderWidth: 2, tension: 0.1, data: [] },
                    { label: 'Emp', borderColor: '#9ca3af', pointRadius: 0, borderWidth: 1, tension: 0.1, data: [] }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { 
                        max: 100, 
                        min: 0, 
                        grid: { color: '#f0f0f0' },
                        title: { display: true, text: 'Porcentagem' } // Adicionei título Y
                    }, 
                    x: { 
                        grid: { display: false },
                        // REMOVI: ticks: { display: false } -> Agora os números aparecem!
                        title: { display: true, text: 'Partidas' } // Adicionei título X
                    } 
                }, 
                plugins: { legend: { display: false } }
            }
        });
    }

    function atualizarGraficos(min, max, v, d, e, sH, sR, n, lados) {
        
        const labels = [];
        for(let i=min; i<=max; i++) labels.push(i);
        const freqH = calcFreq(sH, min, max);
        const freqR = calcFreq(sR, min, max);
        const probs = calcDistTeorica(n, lados);
        const total = historicoPartidas.length || 1; 
        const teoricaScaled = probs.map(p => p * total);

        graficoDistribuicao.data.labels = labels;
        graficoDistribuicao.data.datasets[0].data = teoricaScaled;
        graficoDistribuicao.data.datasets[1].data = freqH;
        graficoDistribuicao.data.datasets[2].data = freqR;
        graficoDistribuicao.update();
        
        graficoResultados.data.datasets[0].data = [v, d, e];
        graficoResultados.update();
    }

    initGraficos();
    
    const n = parseInt(dom.nDados.value);
    const l = parseInt(dom.tipoDado.value);
    atualizarGraficos(n, n*l, 0,0,0, [], [], n, l);

    dom.btnJogar.addEventListener('click', jogar);
    dom.btnSimular.addEventListener('click', simular);
    dom.nDados.addEventListener('change', reset);
    dom.tipoDado.addEventListener('change', reset);
    dom.selCond.addEventListener('change', calcCondicional);

    const toggleModal = (show) => {
        dom.modalOverlay.classList.toggle('modal-oculto', !show);
        dom.modalBox.classList.toggle('modal-oculto', !show);
    };
    dom.infoIcon.addEventListener('click', () => toggleModal(true));
    dom.modalClose.addEventListener('click', () => toggleModal(false));
    dom.modalOverlay.addEventListener('click', () => toggleModal(false));
});