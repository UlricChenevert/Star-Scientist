export class UI {
    constructor () { // Initial call
        this.info_bar = document.getElementById('info-bar');
        this.star_visual = document.getElementById('star-visual');
        this.layers = [document.getElementById('background-layer'), document.getElementById('chromosphere-layer'), document.getElementById('atmosphere-layer')];
        
        this.update_all_layers('resize');

    }
    display_handler (type) { // Publish
        let push = {
            star_info: (object) => {
                document.getElementById("metrics").innerHTML = `
                    <div>Mass: ${object.mass_solar_units} M<sub>&#9737</sub></div>
                    <div>Radius: ${object.radius_solar_units} R<sub>&#9737</sub></div>
                    <div>Luminosity: ${object.luminosity_solar_units} L<sub>&#9737</sub></span></div>
                    <div>Lifetime: ${object.lifetime_years} yr</div>
                    <div>Temperature: ${object.temperature_kevin} K</div>
                    <div>Spectral Classification: ${object.spectral_classification}</div>`;},
        };

        return push[type]();
    }

    display_star(star_info) {
        let radius = star_info.radius_solar_units * 20;
        let color_palette = create_color_palette(star_info.color);
        
        this.update_layer()
    }

    update_layer (layer_index, type) {
        let star_container = this.layers[layer_index];
        const brush = star_container.getContext("2d");
        brush.beginPath();
    
        let type_handler = {
            clear: () => {
                brush.fillStyle = "black";
                brush.fillRect(0, 0, star_container.getAttribute("width"), star_container.getAttribute("height")); 
                brush.stroke();
                return;},
            
            resize: () => {
                star_container.setAttribute("width", parseInt(window.getComputedStyle(this.star_visual).getPropertyValue('width')) ); // Have to access the css width format
                star_container.setAttribute("height", parseInt(window.getComputedStyle(this.star_visual).getPropertyValue('height')) ); // Have to access the css height format
            },


        };
    
        return type_handler[type];
    }

    update_all_layers (type) {
        
        for (let index in this.layers) {
            this.update_layer(index, type)();
        }
    }
    
    build_html (parent_container, object) { // Create recursive html builder
        
    }
}

export function display_star(star_info) {
    const star_container = document.getElementById("chromosphere-layer"); // FIX ME <--- Separate layers
    const brush = star_container.getContext("2d");

    let height = star_container.getAttribute("height");
    let width = star_container.getAttribute("width");
    let radius = star_info.radius_solar_units * 20;
    let color_palette = create_color_palette(star_info.color);

    brush.beginPath();

    draw_corona (brush, height, width, radius, color_palette); // Layer 2
    draw_prominence (brush, height, width, radius); // Layer 2
    draw_chromosphere(brush, height, width, radius, color_palette); // Layer 1
    
    brush.stroke();
}

export function display_star_info(star_info) {
    document.getElementById("metrics").innerHTML = `
        <div>Mass: ${star_info.mass_solar_units} M<sub>&#9737</sub></div>
        <div>Radius: ${star_info.radius_solar_units} R<sub>&#9737</sub></div>
        <div>Luminosity: ${star_info.luminosity_solar_units} L<sub>&#9737</sub></span></div>
        <div>Lifetime: ${star_info.lifetime_years} yr</div>
        <div>Temperature: ${star_info.temperature_kevin} K</div>
        <div>Spectral Classification: ${star_info.spectral_classification}</div>
    `;
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

// Draws the "main body" of the sun
function draw_chromosphere (brush, height, width, radius, color_palette) {
    const shiny_size = radius*0.25;

    // Creating the gradient
    const gradient = brush.createRadialGradient(width/2, height/2, shiny_size, width/2, height/2, radius);
    gradient.addColorStop(0, color_palette.lighter);
    gradient.addColorStop(0.7, color_palette.light);
    gradient.addColorStop(0.9, color_palette.base);
    gradient.addColorStop(1, add_opacity(color_palette.base, 0.0));

    // Applying the gradient
    brush.fillStyle = gradient;
    brush.fillRect(0, 0, width, height);
}

// Draws the "fares" of the sun
function draw_prominence (brush, height, width, radius) {

}

// Draws the "atmosphere" of the sun
function draw_corona (brush, height, width, radius, color_palette) {
    const length = radius*2;

    const gradient = brush.createRadialGradient(width/2, height/2, radius, width/2, height/2, radius+length);
    gradient.addColorStop(0, color_palette.darker);
    gradient.addColorStop(0.5, 'rgb(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgb(0, 0, 0, 0)');
    
    brush.fillStyle = gradient;
    brush.fillRect(0, 0, width, height);

}