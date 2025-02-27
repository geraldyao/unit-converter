// DOM Elements
const conversionTypeSelect = document.getElementById('conversion-type');
const inputValue = document.getElementById('input-value');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const swapUnitsBtn = document.getElementById('swap-units');
const resultValue = document.getElementById('result-value');
const resultUnit = document.getElementById('result-unit');
const formulaText = document.getElementById('formula-text');

// Conversion Units
const conversionUnits = {
    length: {
        meter: { name: 'Meters (m)', factor: 1 },
        kilometer: { name: 'Kilometers (km)', factor: 0.001 },
        centimeter: { name: 'Centimeters (cm)', factor: 100 },
        millimeter: { name: 'Millimeters (mm)', factor: 1000 },
        inch: { name: 'Inches (in)', factor: 39.3701 },
        foot: { name: 'Feet (ft)', factor: 3.28084 },
        yard: { name: 'Yards (yd)', factor: 1.09361 },
        mile: { name: 'Miles (mi)', factor: 0.000621371 }
    },
    weight: {
        kilogram: { name: 'Kilograms (kg)', factor: 1 },
        gram: { name: 'Grams (g)', factor: 1000 },
        milligram: { name: 'Milligrams (mg)', factor: 1000000 },
        pound: { name: 'Pounds (lb)', factor: 2.20462 },
        ounce: { name: 'Ounces (oz)', factor: 35.274 },
        ton: { name: 'Tons (t)', factor: 0.001 }
    },
    temperature: {
        celsius: { name: 'Celsius (°C)', factor: 1 },
        fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
        kelvin: { name: 'Kelvin (K)', factor: 1 }
    },
    volume: {
        liter: { name: 'Liters (L)', factor: 1 },
        milliliter: { name: 'Milliliters (mL)', factor: 1000 },
        cubicMeter: { name: 'Cubic Meters (m³)', factor: 0.001 },
        gallon: { name: 'Gallons (gal)', factor: 0.264172 },
        quart: { name: 'Quarts (qt)', factor: 1.05669 },
        pint: { name: 'Pints (pt)', factor: 2.11338 },
        cup: { name: 'Cups (cup)', factor: 4.22675 },
        fluidOunce: { name: 'Fluid Ounces (fl oz)', factor: 33.814 }
    }
};

// Initialize the app
function init() {
    // Set up event listeners
    conversionTypeSelect.addEventListener('change', updateUnitOptions);
    inputValue.addEventListener('input', performConversion);
    fromUnitSelect.addEventListener('change', performConversion);
    toUnitSelect.addEventListener('change', performConversion);
    swapUnitsBtn.addEventListener('click', swapUnits);
    
    // Initialize unit options
    updateUnitOptions();
    
    // Set initial values
    inputValue.value = 1;
    performConversion();
}

// Update unit options based on selected conversion type
function updateUnitOptions() {
    const conversionType = conversionTypeSelect.value;
    const units = conversionUnits[conversionType];
    
    // Clear existing options
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    
    // Add new options
    for (const unit in units) {
        const fromOption = document.createElement('option');
        fromOption.value = unit;
        fromOption.textContent = units[unit].name;
        fromUnitSelect.appendChild(fromOption);
        
        const toOption = document.createElement('option');
        toOption.value = unit;
        toOption.textContent = units[unit].name;
        toUnitSelect.appendChild(toOption);
    }
    
    // Set default selections (different units)
    if (Object.keys(units).length > 1) {
        toUnitSelect.selectedIndex = 1;
    }
    
    // Perform conversion with new units
    performConversion();
}

// Swap from and to units
function swapUnits() {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    
    performConversion();
}

// Perform the conversion
function performConversion() {
    const conversionType = conversionTypeSelect.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    const value = parseFloat(inputValue.value) || 0;
    
    let result;
    let formula = '';
    
    // Handle temperature conversions separately (they don't use simple factors)
    if (conversionType === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
        formula = getTemperatureFormula(value, fromUnit, toUnit);
    } else {
        // For other conversions, convert to base unit then to target unit
        const fromFactor = conversionUnits[conversionType][fromUnit].factor;
        const toFactor = conversionUnits[conversionType][toUnit].factor;
        
        const baseValue = value / fromFactor;
        result = baseValue * toFactor;
        
        formula = `${value} ${fromUnit} × (${toFactor} / ${fromFactor}) = ${result.toFixed(6)} ${toUnit}`;
    }
    
    // Display the result
    resultValue.textContent = result.toFixed(6);
    resultUnit.textContent = toUnit;
    formulaText.textContent = formula;
}

// Convert temperature
function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        return value;
    }
    
    let celsius;
    
    // Convert to Celsius first
    switch (fromUnit) {
        case 'celsius':
            celsius = value;
            break;
        case 'fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
        case 'kelvin':
            celsius = value - 273.15;
            break;
    }
    
    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'celsius':
            return celsius;
        case 'fahrenheit':
            return celsius * 9/5 + 32;
        case 'kelvin':
            return celsius + 273.15;
    }
}

// Get temperature conversion formula
function getTemperatureFormula(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        return `${value} ${fromUnit} = ${value} ${toUnit}`;
    }
    
    switch (fromUnit) {
        case 'celsius':
            if (toUnit === 'fahrenheit') {
                return `${value}°C × (9/5) + 32 = ${(value * 9/5 + 32).toFixed(6)}°F`;
            } else if (toUnit === 'kelvin') {
                return `${value}°C + 273.15 = ${(value + 273.15).toFixed(6)}K`;
            }
            break;
        case 'fahrenheit':
            if (toUnit === 'celsius') {
                return `(${value}°F - 32) × (5/9) = ${((value - 32) * 5/9).toFixed(6)}°C`;
            } else if (toUnit === 'kelvin') {
                return `(${value}°F - 32) × (5/9) + 273.15 = ${((value - 32) * 5/9 + 273.15).toFixed(6)}K`;
            }
            break;
        case 'kelvin':
            if (toUnit === 'celsius') {
                return `${value}K - 273.15 = ${(value - 273.15).toFixed(6)}°C`;
            } else if (toUnit === 'fahrenheit') {
                return `(${value}K - 273.15) × (9/5) + 32 = ${((value - 273.15) * 9/5 + 32).toFixed(6)}°F`;
            }
            break;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init); 