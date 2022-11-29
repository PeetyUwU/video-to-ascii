// !Important! USE LOCAL SERVER OTHERWISE IT WON'T WORK

const video = document.getElementById('video');
const canvas = document.getElementById('preview');
const context = canvas.getContext('2d', { willReadFrequently: true });

(() => {
	let interval;
	video.onplay = (e) => {
		let video = document.getElementById('video');
		let videoWidth = parseInt(video.style.width);
		let videoHeight = parseInt(video.style.height);
		interval = setInterval(() => {
			//! EDIT DIVISION BY YOUR NEEDS (square video: both / same number, rectangle video: divide width by half you divide height with)
			canvas.height = videoHeight / 2;
			canvas.width = videoWidth / 2;

			context.drawImage(video, 0, 0, canvas.width, canvas.height);

			context.getImageData(0, 0, canvas.width, canvas.height);

			const grayScales = convertToGrayScales(
				context,
				canvas.width,
				canvas.height
			);

			drawAscii(grayScales, canvas.width);
		});
	};
	video.onpause = (e) => {
		clearInterval(interval);
	};
})();

//! to grayscale
const toGrayScale = (r, g, b) => 0.21 * r + 0.72 * g + 0.07 * b;

const convertToGrayScales = (context, width, height) => {
	const imageData = context.getImageData(0, 0, width, height);

	const grayScales = [];

	for (let i = 0; i < imageData.data.length; i += 4) {
		const r = imageData.data[i];
		const g = imageData.data[i + 1];
		const b = imageData.data[i + 2];

		const grayScale = toGrayScale(r, g, b);
		imageData.data[i] =
			imageData.data[i + 1] =
			imageData.data[i + 2] =
				grayScale;

		grayScales.push(grayScale);
	}

	//! DO NOT USE context.putImageData(imageData, 0, 0, width, height);

	return grayScales;
};

const grayRamp =
	'$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ';
const rampLength = grayRamp.length;

const getCharacterForGrayScale = (grayScale) =>
	grayRamp[Math.ceil(((rampLength - 1) * grayScale) / 255)];

const asciiImage = document.querySelector('pre#ascii');

const drawAscii = (grayScales, width) => {
	const ascii = grayScales.reduce((asciiImage, grayScale, index) => {
		let nextChars = getCharacterForGrayScale(grayScale);

		if ((index + 1) % width === 0) {
			nextChars += '\n';
		}

		return asciiImage + nextChars;
	}, '');

	asciiImage.textContent = ascii;
};

function test() {
	convertToGrayScales(context, canvas.width, canvas.height);
}
