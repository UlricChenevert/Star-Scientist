import { constants, Stars } from './dependencies.js';
// Desc: creates new star objects based on template or inputs
export function template_to_star(star_name) {
    const star_template_raw = constants.templates;
    // Creates a template based on the template constants json file
    let template_build = {};
    for (let template of star_template_raw) {
        template_build[template.name] = new Stars.Star(template.mass, template.radius);
    }
    return template_build[star_name];
}
export function sync_latest_input() {
    if (localStorage.getItem("input") !== null) {
        constants.templates.unshift(JSON.parse(localStorage.getItem("input")));
    }
}
