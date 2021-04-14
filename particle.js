class Particle {
	constructor(x, y, mass, velocity) {
		// Setup Particle

		this.position = createVector(x, y)
		this.acceleration = createVector(0, 0)
		this.velocity = velocity
		this.mass = mass

		// πr^2 ∝ m 
		// radius = scale * sqrt(mass / π) 
		this.radius = Math.sqrt(this.mass / PI) * SCALE
		// set random color for particle
		this.color = color(random(0, 255), random(0, 255), random(0, 255))

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

		let netAcceleration = p5.Vector.div(force, this.mass)

		// F = ma --> acceleration = force / mass
	  this.acceleration.add(netAcceleration)

		// draw pretty lines
		if (netAcceleration.x != 0 && netAcceleration.y != 0){
			stroke(255);
			line(this.position.x, this.position.y, 
				(this.position.x + netAcceleration.x*this.mass*SCALE),
				(this.position.y + netAcceleration.y*this.mass*SCALE)
			);
		}

	}

	physics(particle) {
		// Use Particle (Gravitational Interaction)

		// Don't apply to self
		if (this === particle) return
		
		// Distance between particles
		let distance = this.position.dist(particle.position)
		// radius1 + radius2
		let radius = this.radius + particle.radius

		// Don't apply if particles are touching
		if (distance <= radius) return

		// mass1 * mass2
		let mass = this.mass * particle.mass

		// force = G * mass1 * mass2 / distance ** 2
		// Get the vector that is in between this particle's position and the other particle's position, and set it to Gravitational Force
		let force = p5.Vector.sub(this.position, particle.position)
			.setMag(G * mass  / (distance ** 2))
		// https://mathinsight.org/image/vector_b_minus_a	

		// Apply the force
		particle.applyForce(force)

	}

	update() {
		// Update Particle

		// collision detection
		// left wall
		if (this.position.x - this.radius < 0) { 
      this.velocity.x = abs(this.velocity.x);
    } // right wall
		else if (this.position.x + this.radius > width) { 
      this.velocity.x = -abs(this.velocity.x);
    }
		// top wall 
    if (this.position.y - this.radius < 0) {
      this.velocity.y = abs(this.velocity.y);
    } // bottom wall 
		else if (this.position.y + this.radius > height) {
      this.velocity.y = -abs(this.velocity.y);
    }

		let deltaVelocity = p5.Vector.mult(this.acceleration, deltaTime)

		this.velocity.set(this.velocity.add(deltaVelocity))

		this.position.set(this.position.add(p5.Vector.mult(this.velocity, deltaTime)))

		this.acceleration.set(0, 0)

	}

}