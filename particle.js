let BOUNCE_DAMPING = 0.2

class Particle {
	constructor(x, y, mass, velocity, wontMove = false) {
		// Setup Particle

		this.position = createVector(x, y)
		this.acceleration = createVector(0, 0)
		this.velocity = velocity
		this.mass = mass

		// πr^2 ∝ m 
		// radius = scale * sqrt(mass / π) 
		this.radius = Math.sqrt(this.mass / PI) * (0.001*0.001) / SCALE;

		// set random color for particle
		this.color = color(
			`hsl(${Math.floor(random(0, 360))}, 100%, 50%)`
		)
		this.wontMove = wontMove;

	}

	draw() {
		// Draw Particle

		// Remove outline
		noStroke()
		// Set fill to particles color
		fill(this.color)
		// Draw particle
		ellipse(this.position.x, this.position.y, this.radius * 2)
	}

	applyForce(force) {
		// Apple Force to Particle

		// F = ma --> acceleration = force / mass
		let netAcceleration = p5.Vector.div(force, this.mass)
		this.acceleration.add(netAcceleration)

		// draw pretty lines
		if (netAcceleration.x != 0 && netAcceleration.y != 0 && !orbit) {
			stroke(255);
			line(this.position.x, this.position.y,
				(this.position.x + netAcceleration.x * this.mass * SCALE),
				(this.position.y + netAcceleration.y * this.mass * SCALE)
			);
		}

	}

	physics(particle) {
		// Use Particle (Gravitational Interaction)

		// Don't apply to self
		if (this === particle) return
		if (particle.wontMove === true) return

		// Distance between particles
		let distance = this.position.dist(particle.position) / (0.001 / SCALE)
		// radius1 + radius2
		let radius = this.radius + particle.radius

		// Don't apply if particles are touching
		if (distance <= radius) return

		// mass1 * mass2
		let mass = this.mass * particle.mass

		// force = G * mass1 * mass2 / distance ** 2
		// Get the vector that is in between this particle's position and the other particle's position, and set it to Gravitational Force
		let force = p5.Vector.sub(this.position, particle.position)
			// .mult(0.001/SCALE)
			.setMag(G * mass / (distance ** 2))
		// https://mathinsight.org/image/vector_b_minus_a	

		// Apply the force
		particle.applyForce(force)

	}

	update() {
		// Update Particle

		// collision detection
		// left wall
		if (bounce) {
			if (this.position.x - this.radius < -width / 2) {
				this.velocity.x = abs(this.velocity.x) * (1-BOUNCE_DAMPING);
			} // right wall
			else if (this.position.x + this.radius > width / 2) {
				this.velocity.x = -abs(this.velocity.x) * (1-BOUNCE_DAMPING);
			}
			// top wall 
			if (this.position.y - this.radius < -height / 2) {
				this.velocity.y = abs(this.velocity.y) * (1-BOUNCE_DAMPING);
			} // bottom wall 
			else if (this.position.y + this.radius > height / 2) {
				this.velocity.y = -abs(this.velocity.y) * (1-BOUNCE_DAMPING);
			}
		}


		let deltaVelocity = p5.Vector.mult(this.acceleration, deltaTime)

		this.velocity.set(this.velocity.add(deltaVelocity))

		this.position.set(this.position.add(p5.Vector.mult(this.velocity, deltaTime)))

		this.acceleration.set(0, 0)

	}

}