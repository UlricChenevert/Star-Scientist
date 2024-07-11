import { Noise, Utility, Stars, Perlin} from './dependencies.js';

export async function render(star: Stars.Star, body : HTMLCanvasElement, atmosphere : HTMLCanvasElement, background : HTMLCanvasElement) {

    const radius = star.radius.value * 20;
    const amount = 5000;
    const color_palette = Utility.create_color_palette(star.color);

    update_canvas(body).clear();
    update_canvas(atmosphere).clear();
    update_canvas(background).clear();

    //if (! AstronomyMath.is_main_sequence_star(star.mass.value, star.radius.value)) {return;} // "Crash"


    update_canvas(body).chromosphere(radius, color_palette.base);
    update_canvas(atmosphere).corona(radius * 2, color_palette.darker);
    update_canvas(background).background(amount);

    update_canvas(atmosphere).animate_corona_fade_in(radius * 2, color_palette.darker);
}

export function update_canvas(element: HTMLCanvasElement) : valid_canvas_option {
    const brush = Utility.empty_value_checker("canvas's getContext", element.getContext("2d"));
    brush.beginPath();

    async function clear() {
        brush.clearRect(0, 0, element.width, element.height);
    }

    async function chromosphere(radius : number, base_color : string) {
        const width = element.width;
        const height = element.height;

        const center_x = Math.floor(width / 2);
        const center_y = Math.floor(height / 2);

        const bit_amount = 4;
        const noise_amplitude = 50; // Larger the value the more intense the effect

        const octaves = [new Perlin(width,height,1024), new Perlin(width,height,512), new Perlin(width,height,128), new Perlin(width,height,64), new Perlin(width,height,32)]

        const color = Utility.separate(base_color);

        circle({ x: center_x, y: center_y }, radius, (image_array : Uint8ClampedArray, x : number, y : number) => {
            const distance_from_center = Math.hypot((center_x - x), (center_y - y));
            const base_position = y * (element.width * bit_amount) + x * bit_amount;
            
            const intensity = weight(distance_from_center, radius)['circler']();

            const noise = noise_amplitude*blended_noise(x%width, y%height, octaves) - noise_amplitude; //
            
            image_array[base_position] = color[0] + noise; // Modifies red
            image_array[base_position + 1] =  color[1] + noise; // Modifies green
            image_array[base_position + 2] = color[2] + noise; // Modifies blue
            image_array[base_position + 3] = 255*intensity; // Modifies opacity
        });
    }

    async function corona (radius : number, base_color : string) {
        const bit_amount = 4;
        const noise_amplitude = radius * 0.1;
        const center_x = Math.floor(element.width / 2);
        const center_y = Math.floor(element.height / 2);

        let color = Utility.separate(base_color);

        circle({ x: center_x, y: center_y }, radius, (image_array : Uint8ClampedArray, x : number, y : number) => {
            const distance_from_center = Math.hypot((center_x - x), (center_y - y));
            const base_position = y * (element.width * bit_amount) + x * bit_amount;

            const intensity = weight(distance_from_center, radius)['linear']();
            const noise = Noise.random_noise(noise_amplitude);

            image_array[base_position] = color[0] - noise; // Modifies red
            image_array[base_position + 1] = color[1] - noise; // Modifies green
            image_array[base_position + 2] = color[2] - noise; // Modifies blue
            image_array[base_position + 3] = 255 * intensity; // Modifies opacity
        });
    };

    async function circle(center : position, radius : number, modification_function : shape_handler, modifying=false) {
        const center_x = center.x;
        const center_y = center.y;

        let a = new Date();

        // Creating a blank image object
        const circle_image = (modifying)? 
                            brush.getImageData(0, 0, element.width, element.height) 
                            : brush.createImageData(element.width, element.height);
        const data = circle_image.data;

        const diameter = radius * 2;

        // It uses row_index so it does not have to check over the entire screen, only the 'y rows' that the circle can be in
        for (let row_index = 0; row_index < diameter; row_index++) {
            const y = Math.ceil(center_y - radius + row_index); // converts the rows to the y coordinates it needs


            // Only loops over the x-values it needs to modify (min to max)
            const edge_x_to_center_x_distance = Math.floor(Math.sqrt(radius ** 2 - (radius - row_index) ** 2));

            const min_x = center_x - edge_x_to_center_x_distance;
            const max_x = center_x + edge_x_to_center_x_distance;

            for (let x = min_x; x < max_x; x++) {
                modification_function(data, x, y); // This way, you can modify the pixels whichever way you like!
            }

        }

        brush.putImageData(circle_image, 0, 0);

        let b = new Date();
        let c = b.getTime() - a.getTime();
        //console.log(`Rendering the circle took ${c} milliseconds`);
    }

    async function background (amount : number) {
        const stars_images = brush.createImageData(element.width, element.height);
        const data = stars_images.data;
        const bit_amount = 4;

        for (let i = 0; i < amount; i++) {
            const x = Math.ceil(Math.random() * element.width);
            const y = Math.ceil(Math.random() * element.height);

            const base_position = y * (element.width * bit_amount) + x * bit_amount;

            data[base_position] = 255; //Math.random()*255;
            data[base_position + 1] = 255; //Math.random()*255;
            data[base_position + 2] = 255; // Math.random()*255;
            data[base_position + 3] = Math.random() * 255;
        }
        
        brush.putImageData(stars_images, 0, 0);
    };

    function animate_corona_fade_in (radius : number, base_color : string) {
        const bit_amount = 4;
        const center_x = Math.floor(element.width / 2);
        const center_y = Math.floor(element.height / 2);
        let max_distance = 0;

        //const color = Utility.separate(base_color);
        console.log("Fade in")

        const main_body_radius = radius/2;
        

        circle({ x: center_x, y: center_y }, radius, (data : Uint8ClampedArray, x : number, y : number) => {
            //const distance_from_center = Math.hypot((center_x - x), (center_y - y));
            const base_position = y * (element.width * bit_amount) + x * bit_amount;
            const distance_from_center = Math.hypot((center_x - x), (center_y - y));

            if (distance_from_center >= main_body_radius && data[base_position + 3] > 0) {
                data[base_position + 3] = data[base_position + 3] - 1; //Math.random()
                
                if (distance_from_center > max_distance) 
                    max_distance = distance_from_center;
            }; 
        }, true);
        
        (max_distance <= main_body_radius)? 
            requestAnimationFrame(()=>{animate_corona_fade_out(radius, base_color)}) 
            : requestAnimationFrame(()=>{animate_corona_fade_in(radius, base_color)})
    }

    function animate_corona_fade_out (radius : number, base_color : string) {
        const bit_amount = 4;
        const center_x = Math.floor(element.width / 2);
        const center_y = Math.floor(element.height / 2);
        let min_distance = radius * 3;

        const color = Utility.separate(base_color);
        console.log("Fade out")

        const main_body_radius = radius/2;
        

        circle({ x: center_x, y: center_y }, radius, (data : Uint8ClampedArray, x : number, y : number) => {
            //const distance_from_center = Math.hypot((center_x - x), (center_y - y));
            const base_position = y * (element.width * bit_amount) + x * bit_amount;
            const distance_from_center = Math.hypot((center_x - x), (center_y - y));

            if (distance_from_center >= main_body_radius && data[base_position + 3] < 255) {
                //data[base_position] = 255;
                const intensity = weight(distance_from_center, radius)['linear']();
                const noise = Noise.random_noise(10);

                data[base_position] = (color[0] - noise)*intensity; // Modifies red
                data[base_position + 1] = (color[1] - noise)*intensity; // Modifies green
                data[base_position + 2] = (color[2] - noise)*intensity; // Modifies blue
                data[base_position + 3] = data[base_position + 3] + 1; // Modifies opacity //

                //data[base_position + 3] = data[base_position + 3] + 1; //Math.random()
                
                
                if (distance_from_center < min_distance) 
                    min_distance = distance_from_center;
            }; 
        }, true);
        
        (min_distance >= radius)? 
            requestAnimationFrame(()=>{animate_corona_fade_in(radius, base_color)}) 
            : requestAnimationFrame(()=>{animate_corona_fade_out(radius, base_color)})
    }

    // function animate_corona_fade_out (radius : number, base_color : string) {
    //     const bit_amount = 4;
    //     const center_x = Math.floor(element.width / 2);
    //     const center_y = Math.floor(element.height / 2);
    //     let min_opacity = 0;

    //     //const color = Utility.separate(base_color);
        
    //     const main_body_radius = radius/2

    //     console.log("Fade out")
        
    //     circle({ x: center_x, y: center_y }, radius, (data : Uint8ClampedArray, x : number, y : number) => {
    //         const distance_from_center = Math.hypot((center_x - x), (center_y - y));
    //         const base_position = y * (element.width * bit_amount) + x * bit_amount;
            

    //         if (distance_from_center >= main_body_radius) { // && data[base_position] > 0
                
    //             // data[base_position] = color[0];
    //             // data[base_position + 1] = color[1];
    //             //const noise = Noise.random_noise(10);

    //             // data[base_position] = color[0] //*Utility.normalize(distance_from_center, 1, 0) - noise; // Modifies red
    //             // data[base_position + 1] = color[1]//*Utility.normalize(distance_from_center, 1, 0) - noise // Modifies green
    //             // data[base_position + 2] = color[2]//*Utility.normalize(distance_from_center, 1, 0) - noise // Modifies blue
    //             data[base_position + 3] = data[base_position + 3] + 1;
                
                
    //             if (data[base_position + 3] > min_opacity) min_opacity = data[base_position + 3];
    //         }; 
    //     }, true);
        
    //     (min_opacity < 255)? requestAnimationFrame(()=>{animate_corona_fade_out(radius, base_color)}) : requestAnimationFrame(()=>{animate_corona_fade_in(radius, base_color)})  
    // }


    return {
        clear: clear,
        chromosphere: chromosphere,
        corona: corona,
        background: background,
        animate_corona_fade_in: animate_corona_fade_in,
        animate_corona_fade_out: animate_corona_fade_out
    };
}

function weight(distance : number, radius : number, inverted = false) : {linear: ()=> number, circler: ()=> number} {
    return {
        linear: () => {
            return Utility.normalize(distance, 0, radius, inverted);
        },
        circler: () => {
            
            return Utility.normalize(Math.sqrt(radius ** 2 - distance ** 2), radius, 0, inverted);
        },
    };
}

function blended_noise(x : number, y : number, octaves : Perlin[]) {
    return octaves[0].getHeight(x,y)*2 + octaves[1].getHeight(x,y) + octaves[2].getHeight(x,y) + octaves[3].getHeight(x,y)/2 + octaves[4].getHeight(x,y)/2 //octaves[4].getHeight(x,y) //octaves[0].getHeight(x,y)*2 + octaves[1].getHeight(x,y) + octaves[2].getHeight(x,y) + octaves[3].getHeight(x,y)/2 + octaves[4].getHeight(x,y)/4; //(Perlin.noise.simplex2(x*100/radius, y*100/radius)*0.7 + Perlin.noise.simplex2(x*25/radius, y*25/radius)*0.2 + Perlin.noise.simplex2(x*10/radius, y*10/radius)*0.1)
}