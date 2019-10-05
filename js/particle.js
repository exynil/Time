class Particle {
	constructor(id, radius, mass, speed, acceleration, x, y, color) {
		this.id = id;
		this.radius = radius;
		this.mass = mass;
		this.speed = speed;
		this.acceleration = acceleration;
		this.x = x;
		this.y = y;
		this.velocity = {
			x: Math.random() - 0.5,
			y: Math.random() - 0.5
		};
		this.color = color;
	};

	Update(particles) {
		this.Draw();

		for (let i = 0; i < particles.length; i++) {
			if (this === particles[i]) continue;
			if (getDistance(this.x, this.y, particles[i].x, particles[i].y) - this.radius - particles[i].radius < 0) {
				resolveCollision(this, particles[i]);
			}
		}

		if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
			this.velocity.x = -this.velocity.x;
		}

		if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
			this.velocity.y = -this.velocity.y;
		}

		this.x += this.velocity.x * this.speed;
		this.y += this.velocity.y * this.speed;
	}

	Draw() {
		ctx.beginPath();
		ctx.save();
		ctx.shadowBlur = this.radius * 25 / 15;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
		ctx.closePath();
	}
}

function getDistance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function rotate(velocity, angle) {
	const rotatedVelocities = {
		x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
		y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
	};

	return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
	const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
	const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

	const xDist = otherParticle.x - particle.x;
	const yDist = otherParticle.y - particle.y;

	if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
		const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

		const m1 = particle.mass;
		const m2 = otherParticle.mass;

		const u1 = rotate(particle.velocity, angle);
		const u2 = rotate(otherParticle.velocity, angle);

		const v1 = {
			x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
			y: u1.y
		};
		const v2 = {
			x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2),
			y: u2.y
		};

		const vFinal1 = rotate(v1, -angle);
		const vFinal2 = rotate(v2, -angle);

		particle.velocity.x = vFinal1.x;
		particle.velocity.y = vFinal1.y;

		otherParticle.velocity.x = vFinal2.x;
		otherParticle.velocity.y = vFinal2.y;
	}
}