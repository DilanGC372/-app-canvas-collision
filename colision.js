const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Dimensiones del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Configurar el tamaño del canvas
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, text, speedY) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color;
    this.text = text;
    this.dx = Math.random() * 1.5 - 0.75; // Movimiento lateral aleatorio
    this.dy = -speedY; // Movimiento hacia arriba
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

    // Actualizar posición
    this.posX += this.dx;
    this.posY += this.dy;

    // Rebotar en las paredes laterales
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Reaparecer en la parte inferior si sale por la parte superior
    if (this.posY + this.radius < 0) {
      this.posY = window_height - this.radius;
      this.posX = Math.random() * (window_width - this.radius * 2) + this.radius;
    }
  }

  // Método para verificar si el clic está dentro del círculo
  isClicked(mouseX, mouseY) {
    const dx = mouseX - this.posX;
    const dy = mouseY - this.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius;
  }

  // Método para manejar la colisión entre dos círculos
  handleCollision(otherCircle) {
    const dx = otherCircle.posX - this.posX;
    const dy = otherCircle.posY - this.posY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Verificar si los círculos están colisionando
    if (distance < this.radius + otherCircle.radius) {
      // Calcular las direcciones de las velocidades (desplazamiento en X y Y)
      const angle = Math.atan2(dy, dx);
      const speed1 = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      const speed2 = Math.sqrt(otherCircle.dx * otherCircle.dx + otherCircle.dy * otherCircle.dy);

      // Calcular las nuevas velocidades (esto es la parte física de la colisión)
      const direction1 = Math.atan2(this.dy, this.dx);
      const direction2 = Math.atan2(otherCircle.dy, otherCircle.dx);

      // Usamos fórmulas de colisión de elasticidad perfecta (rebote)
      const newDx1 = speed2 * Math.cos(direction2 - angle);
      const newDy1 = speed2 * Math.sin(direction2 - angle);
      const newDx2 = speed1 * Math.cos(direction1 - angle);
      const newDy2 = speed1 * Math.sin(direction1 - angle);

      // Actualizamos las velocidades
      this.dx = newDx1 * Math.cos(angle) - newDy1 * Math.sin(angle);
      this.dy = newDx1 * Math.sin(angle) + newDy1 * Math.cos(angle);

      otherCircle.dx = newDx2 * Math.cos(angle) - newDy2 * Math.sin(angle);
      otherCircle.dy = newDx2 * Math.sin(angle) + newDy2 * Math.cos(angle);

      // Cambiar color a azul y luego restaurar (efecto de flasheo)
      if (!this.isFlashing) {
        this.color = "#0000FF";
        this.isFlashing = true;
        setTimeout(() => {
          this.color = this.originalColor;
          this.isFlashing = false;
        }, 200);
      }

      if (!otherCircle.isFlashing) {
        otherCircle.color = "#0000FF";
        otherCircle.isFlashing = true;
        setTimeout(() => {
          otherCircle.color = otherCircle.originalColor;
          otherCircle.isFlashing = false;
        }, 200);
      }
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
    let y = window_height - radius; // Inicia justo antes del margen inferior
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speedY = Math.random() * 1.5 + 0.5; // Velocidad entre 0.5 y 2
    let text = `C${i + 1}`; // Etiqueta del círculo
    circles.push(new Circle(x, y, radius, color, text, speedY));
  }
}

// Detectar clic del mouse y eliminar un círculo
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Filtrar los círculos que no fueron clickeados
  circles = circles.filter((circle) => !circle.isClicked(mouseX, mouseY));
});

// Función para detectar colisiones entre los círculos
function detectCollisions() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      circles[i].handleCollision(circles[j]); // Comprobar colisiones
    }
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach((circle) => {
    circle.update(ctx); // Actualizar cada círculo
  });
  detectCollisions(); // Detectar colisiones
  requestAnimationFrame(animate); // Repetir la animación
}

// Generar círculos y comenzar la animación
generateCircles(10); // Cambia este número si necesitas más círculos
animate();
