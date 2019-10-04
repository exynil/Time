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
		this.opacity = 0;
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
		ctx.shadowBlur = 25;
		ctx.shadowColor = this.color;
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		ctx.fill();
		ctx.restore();
		ctx.closePath();
	}
}