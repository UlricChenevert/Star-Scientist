function main () {
    const canvas = <HTMLCanvasElement>document.getElementById("canvas");

    initialize(canvas);

    const audio_context = new AudioContext();
    let zero = audio_context.currentTime;
    
    animate(canvas);
    
}

function initialize (canvas: HTMLCanvasElement) {
    const bit_amount = 4;
    const brush = <CanvasRenderingContext2D> canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    const circle_image = brush.createImageData(width, height);
    const data = circle_image.data;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const base_position = y * (width * bit_amount) + x * bit_amount;

            data[base_position] = 100; //Math.random()*255;
            data[base_position + 1] = 255; //Math.random()*255;
            data[base_position + 2] = 100; // Math.random()*255;
            data[base_position + 3] = 255;
        }
    }

    brush.putImageData(circle_image, 0, 0);
}

function animate (canvas: HTMLCanvasElement) {

    // Filters all calls not equal to 15 ms
    const bit_amount = 4;
    const brush = <CanvasRenderingContext2D> canvas.getContext("2d", { willReadFrequently: true });

    const width = canvas.width;
    const height = canvas.height;

    const circle_image = brush.getImageData(0, 0, width, height);
    const data = circle_image.data;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const base_position = y * (width * bit_amount) + x * bit_amount;

            data[base_position] = 255; //Math.random()*255;
            data[base_position + 1] = 255; //Math.random()*255;
            data[base_position + 2] = 255; // Math.random()*255;
            
            data[base_position + 3] = (data[base_position + 3] > 0)? data[base_position + 3] - Math.random() : 255;
        }
    }

    brush.putImageData(circle_image, 0, 0);
    
    
    requestAnimationFrame(()=>{this.animate(canvas)})
}

