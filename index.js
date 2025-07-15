let modoBlanco = false; //Esta variable controla si el fondo y los elementos se muestran en modo blanco o modo negro.
//Cuando modoBlanco está en true, se usan las imágenes y colores claros.
//Cuando está en false, se usa el modo oscuro.
//Esto permite alternar estilos visuales dinámicamente.

let img, imgBlanca, iimg, iimgblanco; //Aquí se reservan variables para guardar imágenes:
//img: imagen de fondo en modo oscuro.
//imgBlanca: imagen de fondo en modo claro.
//iimg: imagen del abecedario en oscuro.
//iimgblanco: imagen del abecedario en claro.
//Se cargan en preload() para poder mostrarlas rápido en draw().

let baseSize = 150; //Define el tamaño base del círculo de zoom que aparece cuando pasás el mouse arriba.
//Este valor es la base sobre la que se calcula el “pulso” animado (efecto de latido).

let pulse = 0; //Es la variable que guarda cuánto crece o achica momentáneamente el círculo de zoom.
//Va cambiando en cada frame usando sin(angle) para que oscile suavemente.

let angle = 0; //Guarda el ángulo que se incrementa en cada frame.
//Se usa para calcular pulse con sin(angle) y así crear un efecto de oscilación continua.

let miFuente, miIFuente; //Guarda las fuentes tipográficas cargadas:
//miFuente: una versión bold.
//miIFuente: una versión regular.
//Se usan para textos fijos como “2025”, “INF” o frases descriptivas.

let cruzX, cruzY, targetX, targetY;//cruzX y cruzY: posición actual de la cruz naranja que sigue al mouse.
//targetX y targetY: posición objetivo hacia donde debería moverse la cruz.
//Permiten que la cruz no “salte”, sino que se mueva suavemente, interpolando con lerp().


let prevMouseX, prevMouseY;//Guarda la posición del mouse en el frame anterior.
//Permite calcular qué tan rápido se mueve (mouseSpeed).

let mouseSpeed = 0; //Guarda la velocidad actual del mouse.
//Se calcula como la distancia entre la posición actual y la previa.
//Se usa para efectos visuales como la opacidad o el tamaño dinámico de la cruz.

let maxDistance = 60; //Define qué tan lejos del centro puede moverse la cruz.
//Si el mouse se aleja demasiado, se limita a esta distancia para que no se descontrole.

let shadowSlider; //Guarda el slider que controla la cantidad de sombra que tiene el texto personalizado.
//Permite que el usuario ajuste visualmente el efecto.

let images = []; //Es un array (lista) que guarda todas las imágenes de números (0, 11, 22, 3, etc.).
//Se cargan en preload() y se muestran según el índice actual numIndex.

let numIndex = 0; //Guarda qué número del array images se está mostrando en este momento.
//Se incrementa o decrementa cuando el usuario hace clic en los botones < o >.

let btnSize = 50; //Define el tamaño de los botones < y > que aparecen para cambiar de número.
//Se usa para dibujarlos con el tamaño correcto y detectar si el usuario hace clic ahí.

let flecha //Guarda la imagen de la flecha.
//Esta imagen se muestra en pantalla como parte de la interfaz.

let myInput, grafkFont, slider, picker, sizeSlider; //myInput: campo donde el usuario puede escribir texto para graficar.
//grafkFont: tipografía GRAFK que se usa para renderizar ese texto.
//slider: controla el “peso” (densidad) del texto escrito.
//picker: selector de color para elegir el color del texto.
//sizeSlider: controla el tamaño del texto.

let vectorImg; //Guarda la imagen vectorial que se usa cuando se hace zoom en modo blanco.
//Permite reemplazar el zoom normal por una imagen especial en ese contexto.

function preload() {//Sirve para cargar archivos pesados como imágenes, sonidos o fuentes antes de que empiece el programa.
  img = loadImage('AJUSTADO-06.jpg');
  imgBlanca = loadImage('AJUSTADO-05.jpg');
  iimg = loadImage('ABECEDARIO.png');
  iimgblanco = loadImage('ABECEDARIOBLANCOs.png');
  miFuente = loadFont('SF-Compact-Text-Bold.otf');
  miIFuente = loadFont('SF-Compact-Display-regular.otf');
  grafkFont = loadFont('GRAFK-Regular-_3_.ttf');
  vectorImg = loadImage('VECTOR.jpg');
flecha = loadImage('FLECHA.png');
// Cargar imágenes numéricas
//Este bloque carga una lista de imágenes de números (0, 11, 22, 3, etc.) desde la carpeta Numeros/.
//Cada imagen se carga con loadImage() y se guarda dentro del array images usando .push().
  images.push(loadImage('Numeros/0.png'));
  images.push(loadImage('Numeros/11.png'));
  images.push(loadImage('Numeros/22.png'));
  images.push(loadImage('Numeros/3.png'));
  images.push(loadImage('Numeros/4.png'));
  images.push(loadImage('Numeros/5.png'));
  images.push(loadImage('Numeros/6.png'));
  images.push(loadImage('Numeros/7.png'));
  images.push(loadImage('Numeros/8.png'));
  images.push(loadImage('Numeros/99.png'));
}

function setup() {
  createCanvas(1500, 3000);
  cruzX = mouseX;
  cruzY = mouseY;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
//Inicia la posición de la cruz naranja (la que sigue al mouse).
//cruzX y cruzY → empiezan en la posición actual del mouse.
//prevMouseX y prevMouseY → guardan la posición previa para calcular la velocidad después.
//Esto asegura que la cruz arranca “pegada” al mouse, sin saltos raros.


  myInput = createInput("GRAFK"); //Crea un campo de texto donde el usuario puede escribir lo que quiera.
  //El texto inicial mostrado es “GRAFK”.

  myInput.position(20, 2500); //Ubica el campo de texto en el lienzo, a 20 px del borde izquierdo y 2500 px del borde superior.
  //Esto lo coloca abajo en tu canvas largo.

  pesoLabel = createP("PESO"); //Crea un pequeño párrafo (etiqueta) que dice “PESO”.
 //Sirve como título para el slider de peso.

pesoLabel.position( 20, 2745);//Ubica esa etiqueta debajo del input de texto.

pesoLabel.style('font-family', 'SF-Compact-Display');
pesoLabel.style('font-size', '12px');
pesoLabel.style('color', '#ff4a00'); // naranja fuerte


  slider = createSlider(0, 10000, 2000);//Crea un slider (barra deslizante) que va de 0 a 10,000, empezando en 2000.
  //Este slider controla el “peso” visual del texto escrito
  slider.position(20, 2770);//Ubica el slider justo debajo de la etiqueta “PESO”.

  sizeLabel = createP("TAMAÑO");//Crea una etiqueta que dice “TAMAÑO” para el slider de tamaño.
sizeLabel.position(20, 2805);
sizeLabel.style('font-family', 'SF-Compact-Display');
sizeLabel.style('font-size', '12px');
sizeLabel.style('color', '#ff4a00');//Le aplica el mismo estilo que a las otras etiquetas.

  sizeSlider = createSlider(10, 150, 72);//Crea un slider que va de tamaño 10 a 150, empezando en 72.
  //Controla el tamaño del texto editable.
  sizeSlider.position(20, 2830);

  shadowLabel = createP("SOMBRA");//Crea la etiqueta “SOMBRA” para el slider de sombra.
shadowLabel.position(20, 2865);
shadowLabel.style('font-family', 'SF-Compact-Display');
shadowLabel.style('font-size', '12px');
shadowLabel.style('color', '#ff4a00');//Le aplica el mismo estilo naranja, tipografía y tamaño.

  shadowSlider = createSlider(0, 50, 10);//Crea un slider que controla la cantidad de sombra detrás del texto.
  //Va de 0 (sin sombra) a 50 (mucha sombra), empezando en 10.
  shadowSlider.position(20, 2890);//Ubica el slider debajo de la etiqueta “SOMBRA”.

  slider.class("miSlider");
  sizeSlider.class("miSlider");
  shadowSlider.class("miSlider");// Les asigna a todos los sliders la clase CSS "miSlider".
  //Esto te permite después darles un mismo estilo visual desde tu CSS (por ejemplo: colores, forma, etc.).

  picker = createColorPicker('#aa0000');//El usuario lo usa para elegir el color del texto editable.
  picker.position(250, 2760);////Ubica el color picker al costado de los sliders, 250 px desde la izquierda, en línea vertical.

  let link = document.querySelector('.link-aplicado');
link.style.opacity = 1;
link.style.pointerEvents = 'auto';
}


//flecha
flecha = loadImage('FLECHA.png');
image(flecha, 300, 1500, flecha.width, flecha.height);



function draw() {
  if (modoBlanco) {
    background(255);
  } else {
    background(0);
  }//Esto define el fondo de pantalla:
   //Si modoBlanco es true, el fondo es blanco (255 → blanco total).
   //Si es false, el fondo es negro (0 → negro total).


  // Calcula cuánto se movió el mouse desde el último frame:
  //Esto sirve para medir la velocidad del mouse.
  let deltaX = mouseX - prevMouseX;//deltaX → diferencia en horizontal.
  let deltaY = mouseY - prevMouseY;//deltaY → diferencia en vertical.

  mouseSpeed = sqrt(deltaX * deltaX + deltaY * deltaY);//Usa el teorema de Pitágoras para calcular la velocidad real (magnitud del movimiento), combinando X e Y.
  //Así, aunque te muevas en diagonal, mide correctamente qué tan rápido te moviste.

  prevMouseX = mouseX;
  prevMouseY = mouseY;//Guarda la posición actual como “posición anterior” para el siguiente frame.
  //Así, en la próxima vuelta del bucle, podrá comparar bien el movimiento nuevo.

  //Define qué imagen usar, según el modo activo:

  let srcImg = modoBlanco ? imgBlanca : img; //srcImg → el fondo principal, blanco o negro.
  let abecedario = modoBlanco ? iimgblanco : iimg; //abecedario → la imagen del abecedario, blanca o negra.
  imageMode(CORNER); //Establece que cuando dibujes imágenes con image(), se posicionen desde la esquina superior izquierda (CORNER), no desde el centro ni otros modos.
  image(srcImg, 0, 0, srcImg.width, srcImg.height); //Dibuja la imagen de fondo (srcImg) en la posición (0, 0), ocupando todo el ancho y alto originales de la imagen.
  image(abecedario, 300, 1500, abecedario.width, abecedario.height);

  // Textos
  fill(modoBlanco ? 0 : 180);//Define el color de relleno del texto:
  //Si estamos en modo blanco → usa negro (0).
  //Si estamos en modo negro → usa gris (180), para que no sea blanco puro y tenga buen contraste.
  
  noStroke();// Asegura que el texto no tenga borde ni contorno, solo relleno.
  textSize(18);
  textAlign(CENTER);// Centra horizontalmente el texto respecto a la posición X que le indiques.
  textFont(miFuente);
  text("2025", 300, 50);

  textSize(13);//Cambia el tamaño del texto a 13 píxeles para los siguientes textos.
  text("INF", 600, 600);//Dibuja el texto “INF” en (600, 600).
  //Como todavía está en modo centrado, se alinea al centro en X.
  
  
  textFont(miIFuente);//Cambia la fuente a miIFuente (SF Compact Display Regular) para los textos explicativos.
  //Así, visualmente marcamos una diferencia entre títulos e informativos.
  textAlign(LEFT);//Cambia la alineación a izquierda
  text("Carefully made\nfor 3d", 50, 600);
  text("GRAFK ES UNA TIPOGRAFIA GEOMETRICA\nDE ALTO IMPACTO, CON TRAZOS GRUESOS\nY FORMAS SOLIDAS.", 640, 605);
 
  text("NUMEROS\n1-10", 200, 1150);
    textFont(miFuente);
 text("PROGRAMACION\nORIENTADA AL DISEÑO.", 1300, 600);

  // Zoom circular
  angle += 0.1;//Incrementa el valor de angle en cada frame.
  //Esto hace que el sin(angle) (seno del ángulo) genere una oscilación continua (efecto de onda).
  
  pulse = sin(angle) * 10;//Calcula un valor de pulso entre -10 y +10.
  //El sin(angle) oscila entre -1 y 1, y al multiplicarlo por 10, genera un suave latido visual.

  let zoomRadius = baseSize + pulse;//Define el radio final del círculo de zoom:
  //El tamaño base (150) más el pulso dinámico, que lo hace latir suavemente.

  let zoomFactor = 2;
  let zoomSize = zoomRadius / zoomFactor;//Calcula cuánto área de la imagen original vamos a recortar para hacer zoom.
  //Por ejemplo, si el círculo mide 150, vamos a recortar un área de 75 px.

  let sx = constrain(mouseX - zoomSize / 2, 0, srcImg.width - zoomSize);
  let sy = constrain(mouseY - zoomSize / 2, 0, srcImg.height - zoomSize);//Calcula dónde empezar a recortar la imagen (desde el mouse, centrado).
  //constrain() asegura que no nos salgamos de los bordes de la imagen.

  if (mouseY < 400) {//Solo activa el efecto de zoom si el mouse está en la parte superior del lienzo (Y < 400).
                     //Esto lo limita a una zona específica.
    push();
    translate(mouseX, mouseY);
    imageMode(CENTER);

    let mask = createGraphics(zoomRadius, zoomRadius);
    mask.ellipse(zoomRadius / 2, zoomRadius / 2, zoomRadius, zoomRadius);// Crea una máscara circular del tamaño del zoom, centrada.

    if (modoBlanco) {//Si estamos en modo blanco:
      //Recorta un área de la imagen vectorImg (especial para este modo).
      //Aplica la máscara circular.
      //La dibuja centrada en el mouse.
      let vectorCrop = vectorImg.get(mouseX - zoomRadius / 2, mouseY - zoomRadius / 2, zoomRadius, zoomRadius);
      vectorCrop.mask(mask);
      image(vectorCrop, 0, 0, zoomRadius, zoomRadius);

    } else { //Si estamos en modo negro:
      //Recorta un área de la imagen de fondo (img) donde está el mouse.
      //Aplica la máscara circular.
      //La dibuja como un zoom suave.
      let zoomed = img.get(sx, sy, zoomSize, zoomSize);
      zoomed.mask(mask);
      image(zoomed, 0, 0, zoomRadius, zoomRadius);
    }

    //Dibuja un contorno circular (negro o blanco) alrededor del zoom, para remarcarlo visualmente:
    noFill();
    stroke(modoBlanco ? 0 : 255);
    strokeWeight(1);
    ellipse(0, 0, zoomRadius, zoomRadius);
    pop();//Restaura el estado gráfico previo al push(), para que no afecte lo demás.



  }


  
      
   //Dibuja una barra naranja horizontal arriba de todo (de borde a borde, 10 px de alto).
   //Sirve como detalle gráfico:
fill(255, 54, 0);
rect(0, 0, 1500,10);
 noStroke();
  textSize(18);
  textAlign(CENTER);
  textFont(miFuente);
  text("GRUFK STUDIO™\n", 100, 60);//Escribe el texto “GRUFK STUDIO™” en naranja

  //Llama a funciones que:
  //Calculan la nueva posición de la cruz naranja suave, en base al mouse y la velocidad.
  //Dibujan la cruz animada, con opacidad y tamaño dinámico.
  updateCruzPosition(mouseX, mouseY, zoomRadius);
  drawSmoothCruz();


  // TEXTO GRAFICADO
  let msg = myInput.value();//msg: texto escrito en el input.
  let c = picker.value();//c: color elegido en el color picker.
  let weight = slider.value();//weight: valor del slider de peso → controla cuántas capas de texto se dibujan.
  let size = sizeSlider.value();//size: tamaño del texto.
  let shadow = shadowSlider.value();//shadow: cantidad de sombra.

  //Configura la sombra del texto:
  drawingContext.shadowOffsetX = shadow; //Desplazamiento en X e Y.
  drawingContext.shadowOffsetY = shadow; //Desplazamiento en X e Y.
  drawingContext.shadowBlur = shadow / 2; //Difuminado (blur) a la mitad del valor.
  drawingContext.shadowColor = 'black';//Color negro.
  //Esto genera un efecto visual tipo “glow” o relieve.
  
  
  //Prepara estilo para el texto editable:
  textFont(grafkFont);//Usa la fuente GRAFK.
  textSize(size);//Tamaño elegido.
  fill(c);//Color elegido.
  noStroke();//Sin contorno.
  textAlign(LEFT);//Alineado a la izquierda.


  for (let dx = -weight / 2000; dx <= weight / 7500; dx += 0.5) {
    for (let dy = -weight / 2000; dy <= weight / 7500; dy += 0.5) {
      text(msg, 20 + dx, 2630 + dy);
    }
  }//Dibuja muchas capas del mismo texto, ligeramente desplazadas en X e Y.
   //Esto genera un efecto de “peso visual”:
   //Si weight es bajo : menos capas.
   //Si weight es alto : más capas, dando sensación de grosor, vibración o sombra.


 //Restaura la configuración de sombra a cero para que no afecte a los elementos siguientes:
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = 0;

  //Cambia dinámicamente los colores de fondo y borde de los sliders en CSS según el modo activo:
  //Fondo blanco con borde negro, o
  //Fondo negro con borde blanco.
  //Esto mantiene coherencia visual en modo claro/oscuro.
  let bg = modoBlanco ? '#ffffff' : '#000000';
  let border = modoBlanco ? '#000000' : '#ffffff';
  document.documentElement.style.setProperty('--slider-bg', bg);
  document.documentElement.style.setProperty('--slider-border', border);


  // Mostrar imagen del número seleccionado
  if (images.length > 0) {//Verifica que haya imágenes cargadas en el array images.
    let numeroImg = images[numIndex];//La imagen del número actual.
    let x = width / 2;//Posición al centro horizontal (x).
    let y = 1250;//Altura en 1250 px (y).
    let displayW = 200;//Ancho fijo 200 px.
    let displayH = (numeroImg.height / numeroImg.width) * displayW;//Alto proporcional (para no deformar la imagen).
    imageMode(CENTER);//Dibuja la imagen del número, centrada.
    image(numeroImg, x, y, displayW, displayH);

    // Botones "<" y ">"
    //Dibuja dos rectángulos redondeados (botones) a la izquierda y derecha del número.
    //El color cambia según modo.
    fill(modoBlanco ? 230 : 40);
    noStroke();
    rect(x - 130, y - btnSize / 2, btnSize, btnSize, 10);
    rect(x + 80, y - btnSize / 2, btnSize, btnSize, 10);


    //Dibuja los signos < y > sobre esos botones, para indicar navegación.
    fill(modoBlanco ? 0 : 255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text("<", x - 105, y);
    text(">", x + 105, y);
  }

  // Restaurar modo imagen por defecto para evitar bugs
  imageMode(CORNER);
  drawInteractiveGrid(0, 700, width, 120);  //Llama a una función (que está definida aparte) para dibujar dos grillas de cuadrados dinámicos.
  drawInteractiveGrid(1050, 2000, 120, 800); //Estas grillas reaccionan al mouse, dando un efecto visual moderno y geométrico.
  
}

function updateCruzPosition(centerX, centerY, circleRadius) {//Esta función calcula la nueva posición de la cruz naranja suave.
  //La cruz sigue al mouse, pero no de golpe: lo hace suave, con velocidad controlada.

  let speedFactor = map(mouseSpeed, 0, 50, 0.05, 0.3);//Usa la función map() para convertir la velocidad del mouse (mouseSpeed)
  //en un valor entre 0.05 (lento) y 0.3 (rápido).
  //Ejemplo:
  //Si el mouse va lento: mueve la cruz despacio.
  //Si el mouse va rápido: mueve la cruz más rápido.
  
  
  speedFactor = constrain(speedFactor, 0.05, 0.3);//Se asegura que speedFactor nunca se pase de esos límites,
  //aunque mouseSpeed tenga valores raros (ej. negativos o gigantes).
  targetX = mouseX;
  targetY = mouseY;//Define que el objetivo de la cruz es la posición actual del mouse.

  let distFromCenter = dist(targetX, centerX, targetY, centerY);// Calcula la distancia desde el centro (centerX, centerY) al punto objetivo.

  if (distFromCenter > maxDistance) {//Si esa distancia es mayor que maxDistance (60 px, por defecto),
    //la cruz no va directo al mouse, sino que se limita.
    let angle = atan2(targetY - centerY, targetX - centerX);//Calcula el ángulo (en radianes) entre el centro y el mouse.
    targetX = centerX + cos(angle) * maxDistance; // Calcula un punto límite a maxDistance de distancia, en la dirección correcta,
    //usando funciones trigonométricas (cos para X, sin para Y).
    targetY = centerY + sin(angle) * maxDistance; 
  }
  //Usa lerp() para mover suavemente cruzX y cruzY hacia targetX y targetY,
  //con un paso proporcional a speedFactor.
  //Esto crea ese efecto lindo de deslizamiento, evitando que la cruz “salte”.
  cruzX = lerp(cruzX, targetX, speedFactor);
  cruzY = lerp(cruzY, targetY, speedFactor);
}

function drawSmoothCruz() {//Esta función dibuja la cruz naranja en pantalla, con opacidad y tamaño dinámico según la velocidad del mouse.
  
  let d = map(mouseSpeed, 0, 20, 18, 25);//Calcula cuánto mide cada línea de la cruz:
  //Si el mouse está quieto: 18 px.
  //Si se mueve rápido: hasta 25 px.
  //Esto hace que la cruz crezca cuando te movés rápido.
  
  let opacity = map(mouseSpeed, 0, 30, 150, 255);//Calcula la opacidad (transparencia) de la cruz:
  //Lenta: medio transparente.
  //Rápida: bien visible.
  //Esto da un efecto de “respuesta viva” al movimiento.

stroke(255, 54, 0, opacity); //Define el color del contorno de la cruz: naranja fuerte (255, 54, 0) con la opacidad calculada.
  strokeWeight(1.5);
  drawCruzGlow(cruzX, cruzY, d, opacity * 0.3);//Llama a otra función (no incluida acá) que dibuja un brillo extra alrededor de la cruz, usando una opacidad más baja.

  //Dibuja la cruz:
  line(cruzX - d, cruzY, cruzX + d, cruzY);//Línea horizontal (-d a +d en X).
  line(cruzX, cruzY - d, cruzX, cruzY + d);//Línea vertical (-d a +d en Y).
fill(255, 54, 0, opacity);
  noStroke();
  ellipse(cruzX, cruzY, 2, 2);//Dibuja un pequeño círculo naranja (2 px) en el centro de la cruz, como detalle para marcar el punto exacto.
}

function drawCruzGlow(x, y, size, glowOpacity) {//Esta función dibuja un brillo extra alrededor de la cruz naranja.
  for (let i = 0; i < 3; i++) {// Hace un bucle de 3 pasos para dibujar 3 capas de líneas, creando un efecto de halo suave.
    stroke(modoBlanco ? 0 : 255, glowOpacity / (i + 1));//Define el color del trazo:
    //Negro si está en modo blanco.
    //Blanco si está en modo oscuro.
    //Con opacidad que disminuye en cada capa (para que se vea como un degradé).
    strokeWeight(3 - i);//Empieza más grueso (3) y termina más fino (1), haciendo que las capas externas sean más suaves.
    line(x - size, y, x + size, y);
    line(x, y - size, x, y + size);//Dibuja líneas horizontales y verticales centradas en (x, y).
    //Esas líneas forman la cruz, pero aquí repetida con distintos pesos y transparencias para lograr un efecto de glow.
    
    
  }
}

function mousePressed() {//Esta función se activa cada vez que hacés clic en cualquier parte del canvas.
  let x = width / 2;
  let y = 1250;//Define el centro donde están los botones de los números.
  

// Si apretaste "<", es decir clickeaste en el rectángulo izquierdo:
//Resta 1 al índice numIndex para ir al número anterior.
//Usa % images.length para que, si llega a -1, vuelva al final (rotación infinita).
  if (mouseX > x - 130 && mouseX < x - 80 && mouseY > y - 25 && mouseY < y + 25) {
    numIndex = (numIndex - 1 + images.length) % images.length;
  }

// Si apretaste ">", es decir clickeaste en el rectángulo derecho:
//Suma 1 al índice numIndex para ir al número siguiente.
//Usa % images.length para volver a 0 cuando llegue al final.
  else if (mouseX > x + 80 && mouseX < x + 130 && mouseY > y - 25 && mouseY < y + 25) {
    numIndex = (numIndex + 1) % images.length;
  }
  
  // Si hiciste clic en cualquier otro lugar (arriba de Y=2650), alterna modoBlanco (lo invierte: de true a false o viceversa).
else if (mouseY < 2650) {
    modoBlanco = !modoBlanco;
  }
}
function drawInteractiveGrid(posX, posY, areaWidth, areaHeight) {// Dibuja una grilla interactiva de cuadrados que reaccionan al mouse.
  push();//Guarda el estado actual (para no afectar lo demás)
  stroke(255, 80, 0, 180); //pone color naranja semitransparente para los bordes
  noFill(); //asegura que los cuadrados no tengan relleno.

  let tileSize = 25;//Tamaño base de cada cuadrado.
  let maxDistance = 500;//Distancia máxima a la que el mouse influye

  for (let y = posY; y < posY + areaHeight; y += tileSize) {
    for (let x = posX; x < posX + areaWidth; x += tileSize) {//Recorre la zona indicada, colocando cuadrados cada 25 px.
      let d = dist(mouseX, mouseY, x, y); //Calcula qué tan lejos está cada cuadrado del mouse.
      let size = map(d, 0, maxDistance, 40, 5, true);//Mapea la distancia a un tamaño:
     //Cerca del mouse: más grande (40 px).
     // Lejos: más pequeño (5 px).
     //El true final fuerza que siempre esté dentro de ese rango.

      rect(x, y, size, size);//Dibuja el cuadrado con el tamaño calculado.
    }
  }

  pop();//Restaura los estilos gráficos anteriores, para que este efecto no afecte al resto del dibujo.
}