
function main () {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const brush = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 800;

    const img = new Image();
    img.src = '../images/blue star.jpg';


    /*img.addEventListener('load', function() {
        brush.drawImage(img, 0, 0, canvas.width, canvas.height);
        const scannedImage = brush.getImageData(0,0, canvas.width, canvas.height);
        
        for (let i = 0; i < data.length, i++) {

        }
    })*/

    
}