const defaults = require('defaults');
const objectPrettify = require('object-prettify');

const TEMPLATE = {
    defindex: 0,
    quality: 0,
    craftable: true,
    tradable: true,
    killstreak: 0,
    australium: false,
    effect: null,
    festive: false,
    paintkit: null,
    wear: null,
    quality2: null,
    craftnumber: null,
    crateseries: null,
    target: null,
    output: null,
    outputQuality: null,
    paint: null
};

/**
 * Format items as strings or objects
 */
class SKU {
    /**
     * Convert SKU to item object
     * @param {String} sku SKU string
     * @return {Object} item Item object
     */
    static fromString (sku) {
        const attributes = {};

        const parts = sku.split(';');
        const partsCount = parts.length;

        if (partsCount > 0) {
            if (isNum(parts[0])) {
                attributes.defindex = parseInt(parts[0]);
            }
            parts.shift();
        }

        if (partsCount > 0) {
            if (isNum(parts[0])) {
                attributes.quality = parseInt(parts[0]);
            }
            parts.shift();
        }

        const partsAdjustedCount = parts.length;

        for (let i = 0; i < partsAdjustedCount; i++) {
            const attribute = parts[i].replace('-', '');

            if (attribute === 'uncraftable') {
                attributes.craftable = false;
            } else if (['untradeable', 'untradable'].includes(attribute)) {
                attributes.tradable = false;
            } else if (attribute === 'australium') {
                attributes.australium = true;
            } else if (attribute === 'festive') {
                attributes.festive = true;
            } else if (attribute === 'strange') {
                attributes.quality2 = 11;
            } else if (attribute.startsWith('kt') && isNum(attribute.substring(2))) {
                attributes.killstreak = parseInt(attribute.substring(2));
            } else if (attribute.startsWith('u') && isNum(attribute.substring(1))) {
                attributes.effect = parseInt(attribute.substring(1));
            } else if (attribute.startsWith('pk') && isNum(attribute.substring(2))) {
                attributes.paintkit = parseInt(attribute.substring(2));
            } else if (attribute.startsWith('w') && isNum(attribute.substring(1))) {
                attributes.wear = parseInt(attribute.substring(1));
            } else if (attribute.startsWith('td') && isNum(attribute.substring(2))) {
                attributes.target = parseInt(attribute.substring(2));
            } else if (attribute.startsWith('n') && isNum(attribute.substring(1))) {
                attributes.craftnumber = parseInt(attribute.substring(1));
            } else if (attribute.startsWith('c') && isNum(attribute.substring(1))) {
                attributes.crateseries = parseInt(attribute.substring(1));
            } else if (attribute.startsWith('od') && isNum(attribute.substring(2))) {
                attributes.output = parseInt(attribute.substring(2));
            } else if (attribute.startsWith('oq') && isNum(attribute.substring(2))) {
                attributes.outputQuality = parseInt(attribute.substring(2));
            } else if (attribute.startsWith('p') && isNum(attribute.substring(1))) {
                attributes.paint = parseInt(attribute.substring(1));
            }
        }

        const item = objectPrettify(defaults(attributes, TEMPLATE), TEMPLATE);

        return item;
    }

    /**
     * Convert item object to SKU
     * @param {Object} item Item object
     * @return {String} sku SKU string
     */
    static fromObject (item) {
        item = objectPrettify(defaults(item, TEMPLATE), TEMPLATE);

        let sku = `${item.defindex};${item.quality}`;

        if (item.effect) {
            sku += `;u${item.effect}`;
        }
        if (item.australium === true) {
            sku += ';australium';
        }
        if (item.craftable === false) {
            sku += ';uncraftable';
        }
        if (item.tradable === false) {
            sku += ';untradable';
        }
        if (item.wear) {
            sku += `;w${item.wear}`;
        }
        if (typeof item.paintkit === 'number') {
            sku += `;pk${item.paintkit}`;
        }
        if (item.quality2 == 11) {
            sku += ';strange';
        }
        if (typeof item.killstreak === 'number' && item.killstreak !== 0) {
            sku += `;kt-${item.killstreak}`;
        }
        if (item.target) {
            sku += `;td-${item.target}`;
        }
        if (item.festive === true) {
            sku += ';festive';
        }
        if (item.craftnumber) {
            sku += `;n${item.craftnumber}`;
        }
        if (item.crateseries) {
            sku += `;c${item.crateseries}`;
        }
        if (item.output) {
            sku += `;od-${item.output}`;
        }
        if (item.outputQuality) {
            sku += `;oq-${item.outputQuality}`;
        }
        if (item.paint) {
            sku += `;p${item.paint}`;
        }

        return sku;
    }
}

function isNum (test) {
    return /^-{0,1}\d+$/.test(test);
}

module.exports = SKU;
