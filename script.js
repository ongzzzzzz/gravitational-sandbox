// Constants
const G = 6.67e-11
const SCALE = 0.001

// Array to store particles
let particles = []

let clicked = false;
let [clickedX, clickedY] = [0, 0]

function generateParticles(){
	particles = []
	// Loop and create each particles
  for (let i = 0; i < 10; i++) {
    let x = random(0, width)
    let y = random(0, height)
    let mass = random(2e8, 1e9)

    // Add the new particle to the list
    particles.push(new Particle(x, y, mass, createVector(0, 0)))
  }
}

function setup() {

	let canvas = createCanvas(windowWidth-20, windowHeight-20)
	// canvas.mouseClicked(addParticle)

	background(0)

  generateParticles()

}

function draw() {
  // Set the background of the canvas to a dark gray
  background(51, 51, 51)

  // Loop all particles twice
  for (const particleA of particles)
    for (const particleB of particles)
      if (particleA !== particleB) particleA.physics(particleB)

  // Loop particles again
  for (const particle of particles) {
    // Update the particle with the new acceleration and velocity
    particle.update()
    // Draw the particle on the canvas
    particle.draw()
  }
	
	stroke(255);
	if (clicked) {
		line(clickedX, clickedY, (2*clickedX)-mouseX, (2*clickedY)-mouseY)
		// console.log(clickedX, clickedY, mouseX, mouseY)
	}

}


function mousePressed(){
	clicked = true;
	clickedX = mouseX; clickedY = mouseY;
}

function mouseDragged(){

}

function mouseReleased(){

	console.log(clickedX-mouseX, clickedY-mouseY)

	particles.push(
		new Particle(
			mouseX, mouseY,
			2e8, 
			createVector(
				SCALE*(clickedX-mouseX), 
				SCALE*(clickedY-mouseY)
			)
		)
	);


	clicked = false;
	[clickedX, clickedY] = [0, 0]

}