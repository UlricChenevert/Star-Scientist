import { Utility } from "./dependencies";

function main () {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const brush = Utility.empty_value_checker("Getting canvas context", canvas.getContext('2d'));

    canvas.width = 800;
    canvas.height = 800;


    function circle (radius = 100) {
        const center_x = Math.floor(canvas.width/2);
        const center_y = Math.floor(canvas.height/2);

        let a = new Date();

        // Creating a blank image object
        const circle_image = brush.createImageData(canvas.width, canvas.height);
        const data = circle_image.data;
        const bit_amount = 4;

        const diameter = radius*2;

        let base_color = [200, 150, 130];
        
        // It uses row_index so it does not have to check over the entire screen, only the 'y rows' that the circle can be in
        for (let row_index = 0; row_index < diameter; row_index++) {
            const y = Math.ceil(center_y - radius + row_index); // converts the rows to the y coordinates it needs
            
            // Only loops over the x-values it needs to modify (min to max)
            const edge_x_to_center_x_distance = Math.floor(Math.sqrt(radius**2 - (radius-row_index)**2));

            const min_x = center_x - edge_x_to_center_x_distance;
            const max_x = center_x + edge_x_to_center_x_distance;
            
            
            for (let x = min_x; x < max_x; x++) {
                const distance_from_center = Math.hypot((center_x - x), (center_y - y));

                const base_position = y * (canvas.width * bit_amount) + x * bit_amount

                const color = 100;
                const intensity = 1 //normalize(get_noise(x, y, radius), 1, -1);

                data[base_position] = base_color[0] * intensity; // Modifies red
                data[base_position + 1] = base_color[1] * intensity; // Modifies green
                data[base_position + 2] = base_color[2] * intensity; // Modifies blue
                data[base_position + 3] = 255; // Modifies opacity

                //console.log(intensity)
            } 
            
        }
        
        brush.putImageData(circle_image, 0, 0);

        let b = new Date();
        let c = b.getTime() - a.getTime();
        console.log(`Rendering the circle took ${c} milliseconds`);
    }



    circle()
}
