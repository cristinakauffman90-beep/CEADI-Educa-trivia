let nivel = 1; let idx = 0; let score = 0;
const niveles = {
    1: [ // NIVEL INICIAL: Peces muy conocidos
        { 
            p: "¿Qué pez tiene piel lisa y manchas circulares?", 
            o: ["Dorado", "Surubí", "Pacú"], 
            c: 1, 
            i: "surubi.png", 
            h: "Es un gran cazador nocturno y su piel no tiene escamas." 
        },
        { 
            p: "¿Cuál es conocido como el 'Tigre del Río' por su color?", 
            o: ["Dorado", "Boga", "Sábalo"], 
            c: 0, 
            i: "dorado.png", 
            h: "Busca un pez que brille como el oro bajo el sol." 
        },
        { 
            p: "¿Qué pez tiene forma de disco y come frutos?", 
            o: ["Tararira", "Pacú", "Piraña"], 
            c: 1, 
            i: "pacu.png", 
            h: "Sus dientes son fuertes para romper semillas que caen al agua." 
        }
    ],
    2: [ // NIVEL AVANZADO: Peces más específicos
        { 
            p: "¿Qué pez tiene una 'armadura' de placas óseas con espinas?", 
            o: ["Armado", "Patí", "Rayada"], 
            c: 0, 
            i: "armado.png", 
            h: "Su nombre lo dice todo: está protegido como un guerrero." 
        },
        { 
            p: "¿Qué pez es de color plateado azulado y vive en lo profundo?", 
            o: ["Bagre", "Sábalo", "Patí"], 
            c: 2, 
            i: "pati.png", 
            h: "Es de piel muy lisa y tiene bigotes muy largos." 
        },
        { 
            p: "¿Qué pez es famoso por sus saltos y su cuerpo alargado?", 
            o: ["Boga", "Patin", "Surubí"], 
            c: 0, 
            i: "boga.png", 
            h: "Es un pez muy deportivo y pelea mucho cuando lo pescan." 
        },
        { 
            p: "¿Cuál de estos peces tiene la boca hacia abajo para succionar lodo?", 
            o: ["Sábalo", "Dorado", "Tararira"], 
            c: 0, 
            i: "sabalo.png", 
            h: "Es la base de la cadena alimenticia del río Paraná." 
        }
    ]
};

function startGame() {
    // 1. INICIAR SONIDO AMBIENTAL
    const ambient = document.getElementById("ambient-river");
    if (ambient) {
        ambient.volume = 0.1; // Volumen bajo (10%) para que no moleste
        ambient.play();
    }

    // 2. Lógica normal de inicio
    nivel = 1;
    idx = 0;
    score = 0;
    document.body.classList.remove("nivel-avanzado");
    document.getElementById("score").innerText = score;

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    
    loadQuestion();
}

function loadQuestion() {
    // --- DETENER SONIDOS ANTERIORES ---
    const sndSuccess = document.getElementById("sound-success");
    const sndError = document.getElementById("sound-error");

    if (sndSuccess) { 
        sndSuccess.pause(); 
        sndSuccess.currentTime = 0; 
    }
    if (sndError) { 
        sndError.pause(); 
        sndError.currentTime = 0; 
    }

    // --- LÍNEA CLAVE PARA LIMPIAR EL MENSAJE ---
    document.getElementById("feedback-message").innerText = "";
    // ------------------------------------------

    const q = niveles[nivel][idx];
    
    // Actualizamos el resto de la interfaz
    document.getElementById("level-indicator").innerText = `Nivel ${nivel}`;
    document.getElementById("question").innerText = q.p;
    
    // Reset de imagen y placeholder
    const img = document.getElementById("fish-image");
    img.src = "./img/" + q.i;
    img.style.display = "none";
    document.getElementById("image-placeholder").style.display = "flex";
    
    // Escondemos el botón de continuar hasta que respondan esta nueva pregunta
    document.getElementById("btn-next").style.display = "none";

    // Cargamos las opciones
    const container = document.getElementById("options-container");
    container.innerHTML = "";
    q.o.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => check(i);
        container.appendChild(btn);
    });
}

function check(answer) {
    const q = niveles[nivel][idx];
    const feedback = document.getElementById("feedback-message");
    const img = document.getElementById("fish-image");
    const placeholder = document.getElementById("image-placeholder");
    const btnNext = document.getElementById("btn-next"); // El botón que se nos pierde

    // 1. REVELAR IMAGEN SIEMPRE
    img.style.display = "block";
    placeholder.style.display = "none";

    // 2. BLOQUEAR BOTONES DE OPCIONES
    const botones = document.querySelectorAll("#options-container button");
    botones.forEach(b => b.disabled = true);

    // 3. LÓGICA DE PUNTOS
    if(answer === q.c) {
        score += 10; // Sumamos puntos por la respuesta correcta
        document.getElementById("score").innerText = score;
        feedback.innerText = "¡CORRECTO! ES UN " + q.o[q.c].toUpperCase();
        feedback.className = "success-text";
        document.getElementById("sound-success")?.play();
    } else {
        feedback.innerText = "¡CASI! ERA UN " + q.o[q.c].toUpperCase();
        feedback.className = "error-text";
        document.getElementById("sound-error")?.play();
    }

    // 4. EL PASO CLAVE: Mostrar el botón de continuar SIEMPRE
    if (btnNext) {
        btnNext.style.display = "block"; 
        console.log("Botón de continuar activado"); // Esto nos ayuda a debuguear
    } else {
        console.error("No se encontró el botón btn-next en el HTML");
    }
}

function next() {
    idx++; // Avanzamos al siguiente índice

    // ¿Todavía hay más preguntas en el nivel en el que estamos?
    if (niveles[nivel] && idx < niveles[nivel].length) {
        // SI HAY: Cargamos la que sigue
        loadQuestion();
    } 
    // Si NO hay más y estamos en el Nivel 1, pasamos al 2
    else if (nivel === 1) {
        // CAMBIO DE NIVEL
        nivel = 2; // Ahora el código mirará el "cajón" 2
        idx = 0;   // Empezamos desde la primera pregunta del nivel 2
        // Aplicamos el diseño visual oscuro
        document.body.classList.add("nivel-avanzado");
        
        // Mostramos el mensaje de transición (Asegúrate de tener esta función)
        if (typeof showAlert === "function") {
            showAlert("¡Nivel 1 Superado!", "Prepárate para las Aguas Profundas del Paraná.");
        } else {
            alert("¡Nivel 1 Superado! Pasando a Aguas Profundas.");
        }
        
        loadQuestion();
    } 
    // Si ya terminamos el Nivel 2, vamos al final
    else {
        showFinal();
    }
}

function showFinal() {
    document.getElementById("quiz-section").style.display = "none";
    document.getElementById("result-screen").style.display = "block";
    
    const finalScoreDisplay = document.getElementById("final-score-display");
    finalScoreDisplay.innerText = score;

    // --- IMPORTANTE: AJUSTA ESTE NÚMERO ---
    // Si tienes 3 preguntas en Nivel 1 y 4 en Nivel 2 = 7 preguntas totales.
    // 7 preguntas x 10 puntos = 70.
    const puntajeMaximoPosible = 70; 

if (score === puntajeMaximoPosible) {
    // Aparece la Medalla de Oro
}
    if (score === puntajeMaximoPosible) {
        document.getElementById("result-title").innerText = "¡MAESTRO DEL PARANÁ!";
        document.getElementById("medal-container").innerHTML = `<img src="img/medalla-oro.png" style="width:150px; animation: bounce 1s infinite;">`;
    } else {
        document.getElementById("result-title").innerText = "¡Buen Trabajo!";
        document.getElementById("medal-container").innerHTML = `<img src="img/medalla-plata.png" style="width:120px;">`;
    }
    // Detener el ambiente al terminar
    const ambient = document.getElementById("ambient-river");
    if (ambient) { ambient.pause(); }

    // ... resto de tu lógica de medalla y confeti ...
}

function getHelp() {
    const h = niveles[nivel][idx].h;
    document.getElementById("chat-window").innerHTML += `<p><b>Guía:</b> ${h}</p>`;
    const win = document.getElementById("chat-window");
    win.scrollTop = win.scrollHeight;
}

function resetGame() {
    location.reload();
}

/// Función para mostrar nuestro alert personalizado
function showAlert(titulo, mensaje) {
    document.getElementById("modal-title").innerText = titulo;
    document.getElementById("modal-text").innerText = mensaje;
    document.getElementById("custom-modal").style.display = "flex";
}

// Función para cerrar el alert
function closeModal() {
    document.getElementById("custom-modal").style.display = "none";
}