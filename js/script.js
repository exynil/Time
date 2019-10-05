var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var colors = ['#00FF7F', '#7B68EE', '#00FFFF'];
var particles = [];

canvas.width = innerWidth;
canvas.height = innerHeight;

// Функция для получения кол-ва дней в месяце
Date.prototype.daysInMonth = function () {
	return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

// Функция для получения кол-ва дней в году
Date.prototype.getDaysInYear = function () {
	return (new Date(new Date().getFullYear(), 11, 31) - new Date(new Date().getFullYear(), 0, 0)) / 86400000;
}

// Функция для получения кол-ва прошедших дней с начала года
Date.prototype.getPassedDaysFromBegginigOfTheYear = function () {
	return (new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) - new Date(new Date().getFullYear(), 0, 0)) / 86400000
}

// Функция для прорисовки текста в указанном месте
function drawText(x, y, text, color) {
	ctx.beginPath();
	ctx.save();
	ctx.font = '30pt Bungee Hairline';
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
	ctx.restore();
	ctx.closePath();
}

// Функция для прорисовки блока прогресса в указанном месте
function drawProgress(x, y, percent, color) {
	ctx.beginPath();
	ctx.save();
	ctx.shadowBlur = 10;
	ctx.shadowColor = '#404040';
	ctx.fillStyle = '#404040';
	ctx.fillRect(x, y, 350, 3);
	ctx.shadowColor = color
	ctx.fillStyle = color;
	ctx.fillRect(x, y, percent * 3.5, 2);
	ctx.restore();
	ctx.closePath();
}

// Отслеживание изменения размера окна
addEventListener('resize', function () {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	for (let i = 0; i < particles.length; i++) {
		if (particles[i].x > canvas.width) {
			particles[i].x = randomIntFromRange(particles[i].radius, canvas.width - particles[i].radius);
		}
		if (particles[i].y > canvas.height) {
			particles[i].y = randomIntFromRange(particles[i].radius, canvas.height - particles[i].radius);
		}
	}
})

// Отслеживание клика
addEventListener('click', function (e) {
	let numberOfBalls = randomIntFromRange(4, 8);

	for (let i = 0; i < numberOfBalls; i++) {
		const radius = randomIntFromRange(2, 15);
		const color = randomColorFromArray(colors);
		const mass = 1;
		const speed = 5;
		const acceleration = 0.1;

		let x = e.pageX;
		let y = e.pageY;

		particles.push(new Particle(particles.length, radius, mass, speed, acceleration, x, y, color));
	}
	console.log(particles);
})

// Инициализация
function init() {
	for (let i = 0; i < 20; i++) {
		const radius = randomIntFromRange(2, 15);
		const color = randomColorFromArray(colors);
		const mass = 1;
		const speed = randomIntFromRange(1, 3);
		const acceleration = 0.1;

		let x = randomIntFromRange(radius, canvas.width - radius);
		let y = randomIntFromRange(radius, canvas.height - radius);

		if (i !== 0) {
			for (let j = 0; j < particles.length; j++) {
				if (getDistance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
					x = randomIntFromRange(radius, canvas.width - radius);
					y = randomIntFromRange(radius, canvas.height - radius);

					j = -1;
				}
			}
		}

		particles.push(new Particle(i, radius, mass, speed, acceleration, x, y, color));
	}
};

init();

// Повторно запускающаяся функция для анимации
function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	particles.forEach(particle => {
		particle.Update(particles);
	});

	var marginTop = canvas.height / 2 - 250;
	var marginLeft = canvas.width / 2 - 175;

	// Вычисление процента дня
	var date = new Date();
	var passedSecondsOfDay = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
	var percent = passedSecondsOfDay / 864;

	marginTop += 100;
	drawText(marginLeft, marginTop, 'Today: ' + percent.toFixed(2) + '%', '#F5F5F5');
	marginTop += 20;
	drawProgress(marginLeft, marginTop, Math.round(percent), colors[0]);

	// Вычисление процента месяца
	var passedDaysFromBegginigOfTheOfMonth = date.getDate();
	percent = passedDaysFromBegginigOfTheOfMonth * 100 / date.daysInMonth();

	marginTop += 100;
	drawText(marginLeft, marginTop, 'Month: ' + percent.toFixed(2) + '%', '#F5F5F5');
	marginTop += 20;
	drawProgress(marginLeft, marginTop, Math.round(percent), colors[1]);

	// Вычисление процента года
	var passedDaysFromBegginigOfTheYear = date.getPassedDaysFromBegginigOfTheYear();
	percent = passedDaysFromBegginigOfTheYear * 100 / date.getDaysInYear();

	marginTop += 100;
	drawText(marginLeft, marginTop, 'Year: ' + percent.toFixed(2) + '%', '#F5F5F5');
	marginTop += 20;
	drawProgress(marginLeft, marginTop, Math.round(percent), colors[2]);
}

animate();

function randomIntFromRange(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function randomColorFromArray(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}