//=========================================================================//
//                         Star Scientist Core                             //
//=========================================================================//
import { Stars, CanvasHandler, math_constants, template_constants, Utility, InputHelpers } from "./dependencies.js";
window.onload = (e) => {
    let local_view_model = new view_model();
    ko.bindingHandlers.storeElement = {
        init: function (element, valueAccessor) {
            valueAccessor()(element);
        }
    };
    ko.bindingHandlers.storeWidthHeight = {
        init: function (element) {
            local_view_model.canvas = { width: getComputedStyle(element).width, height: getComputedStyle(element).height };
        }
    };
    local_view_model.spectral_classification.subscribe((new_value) => {
        local_view_model.timeline(math_constants.stars[new_value].timeline);
    });
    local_view_model.star.subscribe(() => {
        local_view_model.surface.valueHasMutated();
        local_view_model.atmosphere.valueHasMutated();
        local_view_model.background.valueHasMutated();
    });
    local_view_model.surface.subscribe((element) => {
        // Resizes
        element.width = parseFloat(local_view_model.canvas.width);
        element.height = parseFloat(local_view_model.canvas.height);
        let radius = local_view_model.star().radius.value * 20;
        let color_palette = Utility.create_color_palette(local_view_model.star().color);
        CanvasHandler.update_canvas(element).clear();
        CanvasHandler.update_canvas(element).chromosphere(radius, color_palette.base);
    });
    local_view_model.atmosphere.subscribe((element) => {
        // Resizes
        element.width = parseFloat(local_view_model.canvas.width);
        element.height = parseFloat(local_view_model.canvas.height);
        let radius = local_view_model.star().radius.value * 20 * 2;
        let color_palette = Utility.create_color_palette(local_view_model.star().color);
        CanvasHandler.update_canvas(element).clear();
        CanvasHandler.update_canvas(element).corona(radius, color_palette.base);
    });
    local_view_model.background.subscribe((element) => {
        // Resizes
        element.width = parseFloat(local_view_model.canvas.width);
        element.height = parseFloat(local_view_model.canvas.height);
        let amount = 5000;
        CanvasHandler.update_canvas(element).clear();
        CanvasHandler.update_canvas(element).background(amount);
    });
    local_view_model.template.subscribe(() => {
        local_view_model.mass(local_view_model.template().mass);
        local_view_model.radius(local_view_model.template().radius);
    });
    ko.applyBindings(local_view_model);
    //sync_local_storage_to_container('templates-input', 'mass-input', 'radius-input');
};
function view_model() {
    // Inputs
    this.templates = template_constants["star-templates"];
    this.template = ko.observable(this.templates[0]);
    this.isTemplated = ko.computed(() => { return this.template().name != "Custom"; });
    this.mass = ko.observable(this.template().mass);
    this.radius = ko.observable(this.template().radius);
    // Star data
    this.star = ko.computed(() => {
        const a_star = (this.isTemplated()) ? InputHelpers.template_to_star(this.template().name) : new Stars.Star(this.mass(), this.radius());
        return Utility.round_data(a_star, 3);
    });
    //Stars.display(this.star().toObject()) // Initial call
    this.luminosity = ko.computed(() => { return this.star().luminosity.value; });
    this.lifetime = ko.pureComputed(() => { return this.star().lifetime.value; });
    this.temperature = ko.pureComputed(() => { return this.star().temperature.value; });
    this.spectral_classification = ko.computed(() => { return this.star().spectral_classification; });
    this.timeline = ko.observableArray(math_constants.stars[this.spectral_classification()].timeline);
    // Canvas
    this.canvas = {};
    this.atmosphere = ko.observable();
    this.surface = ko.observable();
    this.background = ko.observable();
    // Error
    this.showError = ko.observable(false);
    this.message = ko.observable("Error!");
}
