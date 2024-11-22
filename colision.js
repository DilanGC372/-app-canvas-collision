const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Configura el tamaño del canvas para que ocupe toda la ventana
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speedX, speedY) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color; // Almacena el color original
    this.text = text;
    this.dx = speedX;
    this.dy = speedY;
    this.isFlashing = false; // Bandera para controlar el efecto de flasheo
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // Actualizar la posición X
    this.posX += this.dx;
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Actualizar la posición Y
    this.posY += this.dy;
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speedX = (Math.random() * 3 + 1) * (Math.random() < 0.5 ? -1 : 1); // Velocidad entre 0.5 y 2
    let speedY = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1);
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speedX, speedY));
  }
}

// Función para detectar colisiones entre los círculos
function detectCollisions() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const dx = circles[i].posX - circles[j].posX;
      const dy = circles[i].posY - circles[j].posY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Si la distancia entre los centros es menor que la suma de los radios, hay colisión
      if (distance < circles[i].radius + circles[j].radius) {
        // Invertir velocidades para simular rebote
        [circles[i].dx, circles[j].dx] = [-circles[i].dx, -circles[j].dx];
        [circles[i].dy, circles[j].dy] = [-circles[i].dy, -circles[j].dy];

        // Cambiar a azul temporalmente
        if (!circles[i].isFlashing) {
          circles[i].color = "#0000FF";
          circles[i].isFlashing = true;
          setTimeout(() => {
            circles[i].color = circles[i].originalColor;
            circles[i].isFlashing = false;
          }, 200); // Duración del flasheo
        }

        if (!circles[j].isFlashing) {
          circles[j].color = "#0000FF";
          circles[j].isFlashing = true;
          setTimeout(() => {
            circles[j].color = circles[j].originalColor;
            circles[j].isFlashing = false;
          }, 200); // Duración del flasheo
        }
      }
    }
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach((circle) => {
    circle.update(ctx); // Actualizar cada círculo
  });
  detectCollisions(); // Detectar colisiones entre los círculos
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar 10 círculos y comenzar la animación
generateCircles(10);
animate();
