export * as Stars from './stars.js';
export * as CanvasHandler from './canvas.js';
export * as AstronomyMath from './math.js';
export * as InputHelpers from './input_manipulation.js';
export * as Utility from './utility.js';
export * as Noise from './noise.js'

import { math_json } from '../data/math_constants.js';
export const math_constants = JSON.parse(math_json);

import { star_json } from '../data/star_templates.js';
export const template_constants = JSON.parse(star_json);