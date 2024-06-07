class UI {
    info_bar: HTMLElement;
    star_visual: HTMLElement;
    layers: HTMLElement[];

    constructor () { // Initial call
        this.info_bar = document.getElementById('info-bar');
        this.star_visual = document.getElementById('star-visual');
        this.layers = [document.getElementById('background-layer'), document.getElementById('chromosphere-layer'), document.getElementById('atmosphere-layer')];
        
        for (let layer_index in this.layers) { this.update_canvas(layer_index).resize(); }

    }
    display_handler (type) { // Publish
        let push = {
            star_info: (star) => {
                
                let output_string = ''

                for (let i in star) {
                    if (typeof star[i] != "object") continue; // For color and spectral classification

                    output_string += `<div>${star[i].type}: ${star[i].value} ${star[i].unit}<sub>${star[i].symbol}</sub></div>`;
                }
                // For non-measurement class values
                output_string += `<div>Spectral Classification: ${star['spectral_classification']}</div>`;

                document.getElementById("metrics").innerHTML = output_string;
            },
            star_graphic: (star)  => {
                let radius = star.radius.value * 20;
                let color_palette = create_color_palette(star.color);
                
                for (let layer_index in this.layers) { this.update_canvas(layer_index).clear(); }

                this.update_canvas(1).chromosphere(radius, color_palette.base); // Draws the "main body" of the sun
                this.update_canvas(2).corona(radius*2, color_palette.darker); // Draws the "atmosphere" of the sun
            },
        };

        return push[type];
    }

    update_canvas (layer_index) {
        let star_container = <HTMLCanvasElement>this.layers[layer_index];
        const brush = star_container.getContext("2d");
        brush.beginPath();
        
        function clear () {
            brush.clearRect(0, 0, star_container.width, star_container.height); 

        }

        const resize = () => {
            star_container.width = parseInt(window.getComputedStyle(this.star_visual).width); // Have to access the css width format
            star_container.height = parseInt(window.getComputedStyle(this.star_visual).height); // Have to access the css height format
        }

        function chromosphere (radius, base_color) {
            circle(radius, base_color, Math.sqrt(radius), false, 'circler');
        }

        function corona (radius, base_color) {
            circle(radius, base_color, radius*0.1, true, 'linear');
        }

        function circle (radius, rgb_color, noise_amplitude, inverted_gradient, type, center_x = Math.ceil(star_container.width/2), center_y = Math.ceil(star_container.height/2)) {
            
            // Creating a blank image object
            const circle_image = brush.createImageData(star_container.width, star_container.height);
            const data = circle_image.data;
            const bit_amount = 4;

            const diameter = radius*2;

            let base_color = separate(rgb_color);
            let a = new Date();
            // It uses row_index so it does not have to check over the entire screen, only the 'y rows' that the circle can be in
            for (let row_index = 0; row_index < diameter; row_index++) {
                const y = center_y - radius + row_index; // converts the rows to the y coordinates it needs
                
                // Only loops over the x-values it needs to modify (min to max)
                const edge_x_to_center_x_distance = Math.floor(Math.sqrt(radius**2 - (radius-row_index)**2));

                const min_x = center_x - edge_x_to_center_x_distance;
                const max_x = center_x + edge_x_to_center_x_distance;
                
                
                for (let x = min_x; x < max_x; x++) {
                    const distance_from_center = Math.hypot((center_x - x), (center_y - y));

                    const intensity = weight(distance_from_center, radius, inverted_gradient)[type](); // Fix me

                    const base_position = y * (star_container.width * 4) + x * 4
                    
                    data[base_position] = modify_color(base_color[0], intensity, noise_amplitude); // Modifies red
                    data[base_position + 1] = modify_color(base_color[1], intensity, noise_amplitude); // Modifies green
                    data[base_position + 2] = modify_color(base_color[2], intensity, noise_amplitude); // Modifies blue
                    data[base_position + 3] = 255 * intensity; // Modifies opacity
                } 
                
            }
            brush.putImageData(circle_image, 0, 0);

            let b = new Date();
            let c = b.getTime() - a.getTime();
            console.log(`Rendering the circle took ${c} milliseconds`);


            brush.putImageData(circle_image, 0, 0);
            
        }

        return {
            clear: clear,
            resize: resize,
            chromosphere: chromosphere,
            corona: corona,
        }
    }
}

// Desc: Slaps on a opacity to a rgb string
// Pre: rgb string
// Post: rgba string with alterable opacity
function add_opacity(color, amount) {
    let separated_color = separate(color);
    return `rgba(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]}, ${amount})`;
}

// Converts separates colors into a list
function separate(color) {
    // Remove everything before and after parenthesis
    let color_simplified = color.substring(color.indexOf('(') + 1, color.indexOf(')'));
    // Spilt string
    let rgb = color_simplified.split(',');
    return rgb;
}

function weight (distance, radius, inverted) {
    function linear ()  {
        return normalize(distance, radius, 0, inverted);
    }

    function circler () {
        return normalize(Math.sqrt(radius**2-distance**2), radius, 0, inverted);
    }

    return {
        linear:linear,
        circler:circler,};
}

// Keeps color within bounds
function bound_color(color, limit = 255) {
    return (color > limit)? limit : color;
}

// Why: All colors use this 'equation'
function modify_color (color, weight, noise_amplitude) {
    return bound_color((color - noise(noise_amplitude))*weight);
}

// Desc: returns an object with darker/lighter color variants
// Pre: hexadecimal color
// Post: object with rgb colors
function create_color_palette(color) {
    let separated_color = separate(color);
    
    return {
        base: `rgb(${separated_color[0]}, ${separated_color[1]}, ${separated_color[2]})`,
        
        dark: `rgb(${Math.round(separated_color[0]*0.9)}, ${Math.round(separated_color[1]*0.9)}, ${Math.round(separated_color[2]*0.9)})`,
        darker: `rgb(${Math.round(separated_color[0]*0.8)}, ${Math.round(separated_color[1]*0.8)}, ${Math.round(separated_color[2]*0.8)})`,
        
        light: `rgb(${Math.round(separated_color[0]*1.1)}, ${Math.round(separated_color[1]*1.1)}, ${Math.round(separated_color[2]*1.1)})`,
        lighter: `rgb(${Math.round(separated_color[0]*1.5)}, ${Math.round(separated_color[1]*1.5)}, ${Math.round(separated_color[2]*1.5)})`,
    };
}


function noise (amplitude = 1) {
    return Math.ceil(Math.random() * amplitude);
}

function normalize(value, max, min, inverted = false) {
    return (!inverted)? (value - min) / (max - min) : 1 - (value - min) / (max - min);
}

export default UI;