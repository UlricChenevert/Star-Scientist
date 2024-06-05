export class UI {
    info_bar: HTMLElement;
    star_visual: HTMLElement;
    layers: HTMLElement[];

    constructor () { // Initial call
        this.info_bar = document.getElementById('info-bar');
        this.star_visual = document.getElementById('star-visual');
        this.layers = [document.getElementById('background-layer'), document.getElementById('chromosphere-layer'), document.getElementById('atmosphere-layer')];
        
        this.update_all_layers('resize');

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
                
                this.update_layer(1, 'chromosphere')(radius, color_palette); // Draws the "main body" of the sun
                this.update_layer(2, 'corona')(radius, color_palette); // Draws the "atmosphere" of the sun
                
            },
        };

        return push[type];
    }

    update_layer (layer_index, type) {
        let star_container = <HTMLCanvasElement>this.layers[layer_index];
        const brush = star_container.getContext("2d");
        brush.beginPath();
    
        let type_handler = {
            clear: () => {
                brush.fillStyle = "black";
                brush.fillRect(0, 0, star_container.width, star_container.height); 
                brush.stroke();
                return;},
            
            resize: () => {
                star_container.setAttribute("width", window.getComputedStyle(this.star_visual).width); // Have to access the css width format
                star_container.setAttribute("height", window.getComputedStyle(this.star_visual).height); // Have to access the css height format
            },
            chromosphere: (radius, color_palette) => {
                const center_x = star_container.width/2;
                const center_y = star_container.height/2;
                
                let base_color = separate(color_palette.base);

                const noise_amplitude = 30;
                
                for (let x = 0; x < star_container.width; x++) {
                    for (let y = 0; y < star_container.height; y++) {

                        let distance = Math.sqrt((center_x-x)**2 + (center_y-y)**2);
                        let circle_ize = Math.sqrt(radius**2-distance**2);

                        let weight_normalized = normalize(circle_ize, radius, 0, false); 

                        let red = (base_color[0] - noise(noise_amplitude))*weight_normalized;
                        red = (red > 255)? 255 : red;

                        let green = (base_color[1] - noise(noise_amplitude))*weight_normalized;
                        green = (green > 255)? 255 : green;

                        let blue = (base_color[2] - noise(noise_amplitude))*weight_normalized;
                        blue = (blue > 255)? 255 : blue;

                        brush.fillStyle = `rgba(${red}, ${green}, ${blue}, ${weight_normalized})`;

                        if (((x-center_x)**2 + (y-center_y)**2) <= radius**2) {brush.fillRect(x, y, 1, 1);}
                    }
                }

                brush.stroke();                                         

            },
            corona: (radius, color_palette) => {
                const length = radius*2;

                const gradient = brush.createRadialGradient(star_container.width/2, star_container.height/2, radius, star_container.width/2, star_container.height/2, radius+length);
                gradient.addColorStop(0, color_palette.darker);
                gradient.addColorStop(0.5, 'rgb(0, 0, 0, 0.3)');
                gradient.addColorStop(1, 'rgb(0, 0, 0, 0)');
                
                brush.fillStyle = gradient;
                brush.fillRect(0, 0, star_container.width, star_container.height);
                /*const start_radius = radius*1.0;
                const atmosphere_radius = radius*2;


                const center_x = star_container.width/2;
                const center_y = star_container.height/2;
                
                let base_color = separate(color_palette.darker);

                const noise_amplitude = 10;
                
                for (let x = 0; x < star_container.width; x++) {
                    for (let y = 0; y < star_container.height; y++) {

                        let distance = Math.sqrt((center_x-x)**2 + (center_y-y)**2);

                        let weight_normalized = normalize(distance, atmosphere_radius, 0, true); 

                        let red = (base_color[0] - noise(noise_amplitude))*weight_normalized;
                        red = (red > 255)? 255 : red;

                        let green = (base_color[1] - noise(noise_amplitude))*weight_normalized;
                        green = (green > 255)? 255 : green;

                        let blue = (base_color[2] - noise(noise_amplitude))*weight_normalized;
                        blue = (blue > 255)? 255 : blue;

                        brush.fillStyle = `rgba(${red}, ${green}, ${blue}, ${weight_normalized})`;

                        if (((x-center_x)**2 + (y-center_y)**2) >= start_radius**2) {brush.fillRect(x, y, 1, 1);}
                    }
                }

                brush.stroke(); */

            }



        };
    
        return type_handler[type];
    }

    update_all_layers (type) {
        
        for (let index in this.layers) {
            this.update_layer(index, type)();
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