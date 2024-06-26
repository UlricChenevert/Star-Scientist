//=========================================================================//
//                        Star Scientist Display                           //
//=========================================================================//

import { AstronomyMath } from './dependencies.js'

class Measurement {
    value: number;
    type: string;
    unit: string;
    symbol: string;

    constructor (value : number, type : string, unit: Units='', symbol='') {
        this.value = value;
        this.type = type;
        this.unit = unit;
        this.symbol = symbol;
    }
}

export class Star {
    mass: Measurement;
    radius: Measurement;
    luminosity: Measurement;
    lifetime: Measurement;
    temperature: Measurement;
    spectral_classification: string;
    color: string;

    constructor(mass_solar_units : number, radius_solar_units : number) {
        if (!mass_solar_units || !radius_solar_units) throw new Error("Incorrect parameter call on star constructor!");

        this.mass = new Measurement(mass_solar_units, 'Mass', 'M', '&#9737'); 
        this.radius = new Measurement(radius_solar_units, 'Radius', 'R', '&#9737');
        this.luminosity = new Measurement(AstronomyMath.calculate_luminosity(this.mass.value), 'Luminosity', 'L', '&#9737');
        this.lifetime = new Measurement(AstronomyMath.calculate_lifetime(this.mass.value, this.luminosity.value), 'Lifetime', 'yr');
        this.temperature = new Measurement(AstronomyMath.calculate_temperature(this.luminosity.value, this.radius.value), 'Temperature', 'K');
        this.spectral_classification = AstronomyMath.determine_spectral_classification(this.temperature.value);
        this.color = AstronomyMath.determine_color(this.spectral_classification);
    }

    toObject() {
        return {mass: this.mass, radius: this.radius, luminosity: this.luminosity, lifetime: this.lifetime, temperature: this.temperature, spectral_classification: this.spectral_classification, color: this.color};
    }
}

