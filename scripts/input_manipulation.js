import { constants, Stars } from './dependencies.js';
// Desc: Gets input from input forms and returns the value
export function get_input(container_id) {
    return document.getElementById(container_id);
}
// Desc: creates new star objects based on template or inputs
export function template_to_star(star_name) {
    const star_template_raw = constants.templates;
    // Creates a template based on the template constants json file
    let template_build = {};
    for (let index in star_template_raw) {
        template_build[star_template_raw[index]['name']] = new Stars.Star(parseFloat(star_template_raw[index]['mass']), parseFloat(star_template_raw[index]['radius']));
    }
    return template_build[star_name];
}
