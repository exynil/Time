var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// Функция для получения кол-ва дней в месяце
Date.prototype.daysInMonth = function() {
	return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

// Функция для получения кол-ва дней в году
Date.prototype.getDaysInYear = function() {
	return (new Date(new Date().getFullYear(),11,31) - new Date(new Date().getFullYear(),0,0)) / 86400000;
}

// Функция для получения кол-ва прошедших дней с начала года
Date.prototype.getPassedDaysFromBegginigOfTheYear = function() {
	return (new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()) - new Date(new Date().getFullYear(),0,0))/86400000
}

// Функция для прорисовки текста в указанном месте
function drawText(x, y, text) {
	ctx.beginPath();
	ctx.save();
	ctx.font = "30pt Rajdhani";
	ctx.fillStyle = '#F5F5F5';
	ctx.fillText(text, x, y);
	ctx.restore();
	ctx.closePath();
}

// Функция для прорисовки блока прогресса в указанном месте
function drawProgress(x, y, percent, color) {
	ctx.beginPath();
	ctx.save();
	ctx.shadowBlur = 10;
	ctx.shadowColor = color
	ctx.fillStyle = color;
	ctx.fillRect(x, y, percent * 4, 3);
	ctx.restore();
	ctx.closePath();
}

// Повторно запускающаяся функция для анимации
function animate() {
	requestAnimationFrame(animate);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var marginTop = canvas.height / 2 - 250;
	var marginLeft = canvas.width / 2 - 200;

	// Вычисление процента дня
	var date = new Date();
	var passedSecondsOfDay = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
	var percent = passedSecondsOfDay / 864;

	marginTop += 100;
	drawText(marginLeft, marginTop, 'Today: ' + percent.toFixed(2) + '%');
	marginTop += 20;
	drawProgress(marginLeft, marginTop, Math.round(percent), '#F90043');

	// Вычисление процента месяца
	var passedDaysFromBegginigOfTheOfMonth = date.getDate();
	percent = passedDaysFromBegginigOfTheOfMonth * 100 / date.daysInMonth();

	marginTop += 100;
	drawText(marginLeft, marginTop, 'Month: ' + percent.toFixed(2) + '%');
	marginTop += 20;
	drawProgress(marginLeft, marginTop, Math.round(percent), '#FFC200');

	// Вычисление процента года
	var passedDaysFromBegginigOfTheYear = date.getPassedDaysFromBegginigOfTheYear();
	percent = passedDaysFromBegginigOfTheYear * 100 / date.getDaysInYear();

	marginTop += 100;
	drawText(marginLeft, marginTop, 'Year: ' + percent.toFixed(2) + '%');
	marginTop += 20;
	drawProgress(marginLeft, marginTop, Math.round(percent), '#00B745');
}

animate();

// Отслеживание изменения размера окна
addEventListener('resize', function() {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
})