//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//
import UI from './display.js';
import { calculate_luminosity, calculate_lifetime, calculate_temperature, determine_spectral_classification, determine_color } from './math.js';
import { round_data } from './utility.js';
import { get_input, template_to_star, sync_input, lock_input, sync_local_storage_to_container, sync_container_to_local_storage } from './input_manipulation.js';
export { random_gradient_vector_grid, get_noise } from './noise.js';
import { math_json } from '../data/math_constants.js';
export const math_constants = JSON.parse(math_json);
import { star_json } from '../data/star_templates.js';
export const data_layer = JSON.parse(star_json);
window.onload = (e) => {
    let el = document.getElementById("options");
    let ui = new UI();
    sync_local_storage_to_container('templates-input', 'mass-input', 'radius-input');
    page_update(ui);
    el.addEventListener('input', () => {
        page_update(ui);
        sync_container_to_local_storage('templates-input', 'mass-input', 'radius-input');
    });
};
function page_update(ui) {
    let mass = get_input('mass-input');
    let radius = get_input('radius-input');
    let template = get_input('templates-input');
    let star = template_to_star(template.value, [parseFloat(mass.value), parseFloat(radius.value)]);
    round_data(star, 3);
    sync_input({ container: mass, value: star.mass.value }, { container: radius, value: star.radius.value });
    lock_input(template.value != 'Custom', [mass, radius]);
    ui.display_handler('star_info')(star.toObject());
    ui.display_handler('star_graphic')(star.toObject());
}
class Measurement {
    constructor(value, type, unit = '', symbol = '') {
        this.value = value;
        this.type = type;
        this.unit = unit;
        this.symbol = symbol;
    }
}
export class Star {
    constructor(mass_solar_units, radius_solar_units) {
        this.mass = new Measurement(mass_solar_units, 'Mass', 'M', '&#9737');
        this.radius = new Measurement(radius_solar_units, 'Radius', 'R', '&#9737');
        this.luminosity = new Measurement(calculate_luminosity(this.mass.value), 'Luminosity', 'L', '&#9737');
        this.lifetime = new Measurement(calculate_lifetime(this.mass.value, this.luminosity.value), 'Lifetime', 'yr');
        this.temperature = new Measurement(calculate_temperature(this.luminosity.value, this.radius.value), 'Temperature', 'K');
        this.spectral_classification = determine_spectral_classification(this.temperature.value);
        this.color = determine_color(this.spectral_classification);
    }
    toObject() {
        return { mass: this.mass, radius: this.radius, luminosity: this.luminosity, lifetime: this.lifetime, temperature: this.temperature, spectral_classification: this.spectral_classification, color: this.color };
    }
}
