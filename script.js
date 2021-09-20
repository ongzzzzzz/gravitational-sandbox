// Constants
const G = 6.67e-11
let INITIAL_SCALE = 0.001
let SCALE = 0.001
let M = 3e10

// Array to store particles
let particles = []

let clicked = false;
let [clickedX, clickedY] = [0, 0];
let releasedX = 0, releasedY = 0;


let canvas, zoomSlider, bounceOffWall, showOrbit;
let resizeFactor;

let bounce = false;
let orbit = false;

let dotProd = 0;
let perpendicularError = 1000;

let shootVelocity;
let circularVelocity, escapeVelocity;

function generateParticles() {
	let initialRandomNum = 0;
	particles = []

	particles.push(new Particle(0, 0, M, createVector(0, 0), true))

	// Loop and create each particles
	for (let i = 0; i < initialRandomNum; i++) {
		let x = random(0, width)
		let y = random(0, height)
		let mass = random(2e8, 1e9)

		// Add the new particle to the list
		particles.push(new Particle(x, y, mass, createVector(0, 0)))
	}
}

function setup() {

	// zoomSlider = createSlider(INITIAL_SCALE, 0.01, SCALE, 0.000001)

	bounceOffWall = createCheckbox('Bounce off wall?', bounce);
	bounceOffWall.changed(() => bounce = !bounce);

	showOrbit = createCheckbox('Show orbits?', orbit);
	showOrbit.changed(() => orbit = !orbit);


	canvas = createCanvas(windowWidth, windowHeight - 20);

	background(0)

	generateParticles()
}

function draw() {
	// Set the background of the canvas to black
	if (!orbit) {
		background(0)
	}

	translate(width / 2, height / 2)
	applyMatrix(1, 0, 0, -1, 0, 0);
	// if (!(frameCount % 10)) console.log(SCALE)

	if (clicked) {
		drawPerpLine();
	}

	// Loop all particles twice
	for (const particleA of particles) {
		for (const particleB of particles) {
			if (particleA !== particleB) particleA.physics(particleB)
		}
	}

	// resizeFactor = SCALE / zoomSlider.value();
	resizeFactor = 1;

	// Loop particles again
	for (const particle of particles) {
		if (resizeFactor != 1) {
			// resize particles
			particle.radius *= (resizeFactor);

			particle.position.mult(resizeFactor);
			particle.velocity.mult(resizeFactor);
			particle.acceleration.mult(resizeFactor);
		}

		// Update the particle with the new acceleration and velocity
		particle.update()
		// Draw the particle on the canvas
		particle.draw()

		if (!orbit) {
			push()
			scale(1, -1)
			text(round(particle.velocity.mag(), 3),
				particle.position.x + particle.radius,
				-(particle.position.y - particle.radius));
			pop()
		}
	}

	// if (SCALE != zoomSlider.value()) SCALE = zoomSlider.value()
}


function drawPerpLine() {
	dotProd = clickedX * (clickedX - releasedX) + clickedY * (clickedY - releasedY);

	shootVelocity = Math.sqrt(
		(clickedX - releasedX) ** 2 + (clickedY - releasedY) ** 2
	) * SCALE

	circularVelocity = Math.sqrt(G * M / Math.sqrt(clickedX ** 2 + clickedY ** 2));
	escapeVelocity = Math.SQRT2 * circularVelocity;

	stroke(
		(-perpendicularError < dotProd && dotProd < perpendicularError
			&&
			circularVelocity < shootVelocity && shootVelocity < escapeVelocity)
			? 'green'
			: 'red'
	);

	line(clickedX, clickedY,
		clickedX + (clickedX - (mouseX - width / 2)),
		clickedY + (clickedY - (height / 2 - mouseY))
	)
}


function mousePressed() {
	if (!mouseInCanvas()) return

	clicked = true;
	// subtract, because axes changed
	clickedX = mouseX - width / 2;
	clickedY = height / 2 - mouseY;
}

function mouseDragged() {
	releasedX = mouseX - width / 2;
	releasedY = height / 2 - mouseY;
}

function mouseReleased() {
	// ignore input if mouse not in canvas
	if (!mouseInCanvas() && !clicked) return

	particles.push(
		new Particle(
			clickedX, clickedY,
			2e8,
			createVector(
				(clickedX - releasedX),
				(clickedY - releasedY)
			).mult(SCALE)
		)
	);

	clicked = false;
	[clickedX, clickedY] = [0, 0]
}

function mouseInCanvas() {
	if (mouseX < 0 || mouseX > width
		|| mouseY > height || mouseY < 0) {
		return false;
	} else {
		return true;
	}
}