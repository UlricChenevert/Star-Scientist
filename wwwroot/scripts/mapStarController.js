var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class MapStarController {
    static getTemplates(templates_observable) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/Star/getTemplates`);
            const presents = yield response.json();
            // Get copy of current observable state
            const working_templates = templates_observable();
            // Append copy of current state with new values from server
            for (let key of Object.keys(presents)) {
                working_templates[key] = presents[key];
            }
            // Replace templates with newly modified observable
            templates_observable(working_templates);
        });
    }
    static CalculateMetrics(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/Star/CalculateMetrics?Mass=${context.mass()}&Radius=${context.radius()}`);
            const metrics = yield response.json();
            context.luminosity(metrics.luminosity.toPrecision(3));
            context.lifetime(metrics.lifetime.toPrecision(3));
            context.temperature(metrics.temperature.toPrecision(3));
            context.spectral_classification(metrics.spectralClassification);
        });
    }
}
