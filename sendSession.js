const axios = require("axios");

const WEBHOOK = "https://discord.com/api/webhooks/1462958027945672896/5MGtV3UO8DMcbO91b3LVjF4CTuyqTbKNbgmdvdLTya8woyEG6TcCOMGzaZ6CVtGhDBDK";
const SESSION = process.env.SESSION; 
// FP1, FP2, FP3, QUALY, RACE

async function enviar() {
  let url = "";
  let titulo = "";

  if (SESSION === "FP1") {
    url = "https://f1api.dev/api/v1/current/practice/1/results";
    titulo = "🟢 FP1 – Resultados Finales";
  } else if (SESSION === "FP2") {
    url = "https://f1api.dev/api/v1/current/practice/2/results";
    titulo = "🟢 FP2 – Resultados Finales";
  } else if (SESSION === "FP3") {
    url = "https://f1api.dev/api/v1/current/practice/3/results";
    titulo = "🟢 FP3 – Resultados Finales";
  } else if (SESSION === "QUALY") {
    url = "https://f1api.dev/api/v1/current/qualifying/results";
    titulo = "🟡 Clasificación – Resultados Finales";
  } else if (SESSION === "RACE") {
    url = "https://f1api.dev/api/v1/current/last/race/results";
    titulo = "🏁 Carrera – Resultados Finales";
  } else {
    console.log("Sesión no válida");
    return;
  }

  try {
    const res = await axios.get(url);
    const race = res.data.race;
    const results = res.data.results.slice(0, 10);

    let mensaje = `**${titulo}**\n`;
    mensaje += `🏎️ ${race.raceName}\n\n`;

    results.forEach(r => {
      let extra = "";
      
      if (SESSION === "QUALY") {
        extra = r.q3 || r.q2 || r.q1 || "—";
      } else if (SESSION === "RACE") {
        extra = `${r.points} pts`;
      } else {
        extra = r.time || r.bestLap || "—";
      }

      mensaje += `${r.position}. **${r.driver.name}** (${r.team.name}) – ${extra}\n`;
    });

    await axios.post(WEBHOOK, { content: mensaje });
    console.log("Mensaje enviado:", SESSION);

  } catch (error) {
    console.log("Error obteniendo datos o enviando webhook:", error.message);
  }
}

enviar();
