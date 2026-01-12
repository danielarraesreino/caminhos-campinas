import { spawn } from 'child_process';
import https from 'https';

const APP_URL = "https://caminhos-campinas.vercel.app";

async function checkHealth() {
    console.log(`🔍 [AGENTE VERCEL] Iniciando auditoria em: ${APP_URL}`);

    // 1. Ping the app multiple times to ensure traffic
    console.log("📡 Pingando aplicação para gerar tráfego...");
    const endpoints = ['/', '/api/partners', '/apoie'];

    for (const endpoint of endpoints) {
        https.get(`${APP_URL}${endpoint}`, (res) => {
            console.log(`➡️  GET ${endpoint} | Status: ${res.statusCode}`);
            res.resume();
        }).on('error', (e) => console.error(`Erro em ${endpoint}:`, e.message));
    }

    // 2. Fetch Vercel Logs (Limited window)
    console.log("\n📜 Coletando logs da Vercel (Janela de 15s)...");

    const vercelLogs = spawn('vercel', ['logs', 'caminhos-campinas.vercel.app', '--json']);

    let logData = '';

    vercelLogs.stdout.on('data', (data) => {
        const str = data.toString();
        logData += str;
        // Optional: Stream logs in real-time if needed
        // process.stdout.write(str); 
    });

    vercelLogs.stderr.on('data', (data) => {
        // Vercel CLI often outputs status messages to stderr
        // console.log(`[CLI Info]: ${data}`);
    });

    // Wait 15 seconds to collect logs then kill
    setTimeout(() => {
        vercelLogs.kill();
        processLogs(logData);
    }, 15000);
}

function processLogs(rawLogs: string) {
    console.log("\n📊 [MERCENÁRIO] Analisando dados capturados...");

    const lines = rawLogs.split('\n');
    let errors = 0;
    let slowRequests = 0;
    let totalRequests = 0;

    lines.forEach(line => {
        if (!line.trim()) return;
        try {
            // Try to parse JSON lines if provided in that format
            // Vercel CLI might output mixed text/json
            const entry = JSON.parse(line);
            totalRequests++;

            if (entry.statusCode >= 400) errors++;
            if (entry.proxy && entry.proxy.duration > 1000) slowRequests++;

            // Print interesting logs
            if (entry.statusCode >= 400 || (entry.proxy && entry.proxy.duration > 500)) {
                console.log(`⚠️  [${entry.statusCode}] ${entry.request.method} ${entry.request.uri} (${entry.proxy?.duration}ms)`);
            }

        } catch (e) {
            // Non-JSON line or parse error, just ignore for now or print if suspicious
            if (line.includes("Error") || line.includes("ERR")) {
                console.log(`🔴 LOG TEXTO: ${line}`);
                errors++;
            }
        }
    });

    console.log("\n------- RELATÓRIO DO AGENTE -------");
    console.log(`Total Analisado: ${totalRequests} entradas`);
    console.log(`Erros Encontrados: ${errors}`);
    console.log(`Requisições Lentas (>1s): ${slowRequests}`);

    if (errors === 0 && slowRequests === 0) {
        console.log("✅ SISTEMA ESTÁVEL. Nenhuma anomalia crítica detectada nos logs recentes.");
    } else {
        console.log("⚠️  ATENÇÃO: Existem problemas potenciais. Verifique os detalhes acima.");
    }
}

checkHealth();
