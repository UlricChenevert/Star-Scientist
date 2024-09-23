import { MapStarController, Stars, Utility, InputHelpers, AstronomyMath } from "./dependencies.js";
export function view_model() {
    // Inputs
    this.templates = ko.observable({ "Custom": { mass: 1, radius: 1 } });
    MapStarController.getTemplates(this.templates);
    this.template = ko.observable(this.templates()["Saved"] ? "Saved" : "Custom"); // v, optionsText: template
    this.isTemplated = ko.observable(this.template() != "Custom" && this.template() != "Saved");
    this.mass = ko.observable(this.templates()[this.template()].mass);
    this.radius = ko.observable(this.templates()[this.template()].radius);
    // <----------------------------------- Subscriptions 
    this.template.subscribe(() => {
        this.isTemplated(this.template() != "Custom" && this.template() != "Saved");
        if (this.isTemplated()) {
            this.mass(this.templates()[this.template()].mass);
            this.radius(this.templates()[this.template()].radius);
        }
    });
    // Error
    this.showInputError = ko.computed(() => { return this.mass() == '' || this.radius() == '' || !AstronomyMath.is_main_sequence_star(this.mass(), this.radius()); }); // "Crash"
    this.message = ko.observable("Input is not on main sequence!");
    // Creates and saves Star data
    this.star = ko.computed(() => {
        console.log(`New star created ${this.template()} ${this.mass()} ${this.radius()}`);
        localStorage.setItem("input", JSON.stringify({ "mass": this.mass(), "radius": this.radius() })); // Saves
        return (!this.showInputError()) ? Utility.round_data(InputHelpers.template_to_star(this.template(), this.radius(), this.mass()), 3) : new Stars.Star(1, 1); // Creates and rounds star data
    }).extend({ rateLimit: 0 });
    this.luminosity = ko.computed(() => { return !this.showInputError() ? this.star().luminosity.value : 0; });
    this.lifetime = ko.computed(() => { return !this.showInputError() ? this.star().lifetime.value : 0; });
    this.temperature = ko.computed(() => { return !this.showInputError() ? this.star().temperature.value : 0; });
    this.spectral_classification = ko.computed(() => { return !this.showInputError() ? this.star().spectral_classification : "None"; });
    this.timeline = ko.computed(() => { return !this.showInputError() ? this.star().timeline : [{ type: "None", desc: "None" }]; });
    // Canvases
    this.display = ko.observable();
    console.log("============================= Initial View Model Set ===========================================");
}
