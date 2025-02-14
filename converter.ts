import { AccessoryMessage, CharacteristicMessage, ServiceMessage, getCharacteristicControl } from "./lib/objects";

const HomeyLib = require("homey-lib");

export const CHARACTERISTIC_OPTIONS: {
    [type: string]: {
        useServiceName?: boolean,
        enumConvert?: any[][]
    }
} = {
    On: {
        useServiceName: true
    },
    ProgrammableSwitchEvent: {
        useServiceName: true,
        enumConvert: [[0, "single"], [1, "double"], [2, "hold"]]
    },
    TargetHeatingCoolingState: {
        enumConvert: [[0, "off"], [1, "heat"], [2, "cool"], [3, "auto"], [-1, "fan"], [-2, "dehumidifier"], [-3, "eco"]]
    },
    SecuritySystemTargetState: {
        enumConvert: [[0, "off"], [1, "heat"], [2, "cool"], [3, "auto"], [-1, "fan"], [-2, "dehumidifier"], [-3, "eco"]]
    }
};

export const HOMEY_CAPABILITIES: {
    [capability: string]: string[]
} = {
    homealarm_state: ["SecuritySystemTargetState"],
    onoff: ["On", "TargetFanState", 'Active'],
    dim: ["Brightness"],
    light_hue: ["Hue"],
    light_saturation: ["Saturation"],
    light_temperature: ["ColorTemperature"],
    light_mode: [],
    vacuumcleaner_state: [],
    thermostat_mode: ["TargetHeatingCoolingState"],
    target_temperature: ["TargetTemperature", "HeatingThresholdTemperature"],
    measure_temperature: ["CurrentTemperature"],
    measure_co: ["CarbonMonoxideLevel"],
    measure_co2: ["CarbonDioxideLevel"],
    measure_pm25: ["PM2_5Density"],
    measure_humidity: ["CurrentRelativeHumidity"],
    measure_pressure: [],
    measure_noise: ["C_CurrentNoiseLevel"],
    measure_rain: [],
    measure_wind_strength: [],
    measure_wind_angle: [],
    measure_gust_strength: [],
    measure_gust_angle: [],
    measure_battery: ["BatteryLevel"],
    measure_power: ["C_Watt"],
    measure_voltage: ["C_Volt"],
    measure_current: ["C_Ampere"],
    measure_luminance: ["CurrentAmbientLightLevel"],
    measure_ultraviolet: ["C_CurrentUltraviolet"],
    measure_water: [],
    alarm_generic: [],
    alarm_motion: ["MotionDetected", "OccupancyDetected"],
    alarm_contact: ["ContactSensorState"],
    alarm_co: ["CarbonMonoxideDetected"],
    alarm_co2: ["CarbonDioxideDetected"],
    alarm_pm25: [],
    alarm_tamper: ["StatusTampered"],
    alarm_smoke: ["SmokeDetected"],
    alarm_fire: [],
    alarm_heat: [],
    alarm_water: ["LeakDetected"],
    alarm_battery: ["StatusLowBattery"],
    alarm_night: [],
    meter_power: ["C_KiloWattHour"],
    meter_water: [],
    meter_gas: [],
    meter_rain: [],
    volume_set: ["Volume"],
    volume_up: [],
    volume_down: [],
    volume_mute: ["Mute"],
    channel_up: [],
    channel_down: [],
    locked: [],
    lock_mode: [],
    garagedoor_closed: [],
    windowcoverings_state: [],
    windowcoverings_tilt_up: [],
    windowcoverings_tilt_down: [],
    windowcoverings_tilt_set: [],
    windowcoverings_closed: [],
    windowcoverings_set: ["TargetPosition"],
    button: [],
    speaker_playing: [],
    speaker_next: [],
    speaker_prev: [],
    speaker_shuffle: [],
    speaker_repeat: [],
    speaker_artist: [],
    speaker_album: [],
    speaker_track: [],
    speaker_duration: [],
    speaker_position: [],
    fan_speed: ["C_FanSpeed"],
    rotation_speed: ["RotationSpeed"]
};

export const CUSTOM_CAPABILITIES: {
    [capability: string]: string[]
} = {
    // button: ["ProgrammableSwitchEvent"],
    measure_angle: ["C_Angle"],
    measure_aqi: ["C_AQIDensity"],
    measure_atmospheric_pressure: ["C_CurrentAtmosphericPressure"],
    measure_cubic_meter: ["C_CubicMeter"],
    measure_formaldehyde: ["C_FormaldehydeDensity"],
    measure_frequency: ["C_Frequency"],
    measure_kvah: ["C_KiloVoltAmpereHour"],
    measure_kvarh: ["C_KiloVoltAmpereReactiveHour"],
    measure_motion_level: ["C_CurrentMotionLevel"],
    measure_power_factor: ["C_PowerFactor"],
    measure_pulse_count: ["C_PulseCount"],
    measure_so2: ["SulphurDioxideDensity"],
    measure_va: ["C_VoltAmpere"],
    measure_var: ["C_VoltAmpereReactive"],
    measure_voc: ["VOCDensity"],
    measure_water_level: ["WaterLevel"],
    // alarm_active: ["StatusActive"],
    // alarm_fault: ["StatusFault"],
    alarm_jammed: ["StatusJammed"],
    alarm_noise: ["C_NoiseDetected"]
};

export const CAPABILITIES = { ...HOMEY_CAPABILITIES, ...CUSTOM_CAPABILITIES };

export const DEVICE_OPTIONS: {
    [model: string]: {
        hasIcon?: boolean,
        batteries?: string[]
    }
} = {
    "MFKZQ01LM": { hasIcon: true, batteries: ["CR2450"] },
    "AAQS-S01": { hasIcon: true, batteries: ["CR2450", "CR2450"] },
    "DJT11LM": { hasIcon: true, batteries: ["CR2032"] },
    "GZCGQ01LM": { hasIcon: true, batteries: ["CR2032"] },
    "JTQJ-BF-01LM/BW": { hasIcon: true, batteries: ["CR123A"] },
    "JTYJ-GD-01LM/BW": { hasIcon: true, batteries: ["CR123A"] },
    "LLKZMK11LM": { hasIcon: true },
    "MCCGQ01LM": { hasIcon: true, batteries: ["CR1632"] },
    "MCCGQ11LM": { hasIcon: true, batteries: ["CR1632"] },
    "QBCZ11LM": { hasIcon: true },
    "QBKG03LM": { hasIcon: true },
    "QBKG04LM": { hasIcon: true },
    "QBKG11LM": { hasIcon: true },
    "QBKG12LM": { hasIcon: true },
    "QBKG21LM": { hasIcon: true },
    "QBKG22LM": { hasIcon: true },
    "QBKG23LM": { hasIcon: true },
    "QBKG24LM": { hasIcon: true },
    "QBKG25LM": { hasIcon: true },
    "QBKG26LM": { hasIcon: true },
    "RTCGQ01LM": { hasIcon: true, batteries: ["CR2450"] },
    "RTCGQ11LM": { hasIcon: true, batteries: ["CR2450"] },
    "SJCGQ11LM": { hasIcon: true, batteries: ["CR2032"] },
    "SP-EUC01": { hasIcon: true },
    "SSM-U01": { hasIcon: true },
    "SSM-U02": { hasIcon: true },
    "VOCKQJK11LM": { hasIcon: true, batteries: ["CR2450", "CR2450"] },
    "WRS-R02": { hasIcon: true, batteries: ["CR2032"] },
    "WS-EUK01": { hasIcon: true },
    "WS-EUK02": { hasIcon: true },
    "WS-EUK03": { hasIcon: true },
    "WS-EUK04": { hasIcon: true },
    "WSDCGQ01LM": { hasIcon: true, batteries: ["CR2032"] },
    "WSDCGQ11LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXCJKG11LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXCJKG12LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXCJKG13LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG01LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG02LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG03LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG06LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG07LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG11LM": { hasIcon: true, batteries: ["CR2032"] },
    "WXKG12LM": { hasIcon: true, batteries: ["CR2032"] },
    "ZNCLDJ11LM": { hasIcon: true },
    "ZNCLDJ12LM": { hasIcon: true, batteries: ["INTERNAL"] },
    "ZNCZ02LM": { hasIcon: true },
    "ZNCZ04LM": { hasIcon: true },
    "ZNLDP12LM": { hasIcon: true }
};

const VALID_VALUES_TYPES: string[] = [
    "TargetHeatingCoolingState",
    "SecuritySystemTargetState",
    "C_FanSpeed",
    "C_TargetPositionState"
]

const MIN_MAX_CONVERTED: string[] = [
    "TargetTemperature",
    "C_FanSpeed",
    "RotationSpeed",
    "HeatingThresholdTemperature"
]

export type Capability = {
    title: {
        en: string,
        ru: string
    } | string,
    type: string,
    getable: boolean,
    setable: boolean,
    min?: number,
    max?: number,
    step?: number,
    values?: {
        id: string,
        title: {
            en: string,
            ru: string
        } | string
    }[]
}

export class Converter {
    capabilities!: {
        [capability: string]: Capability
    };

    constructor(customCapabilities: {
        [capability: string]: Capability
    }) {
        this.capabilities = {
            ...HomeyLib.getCapabilities(),
            ...customCapabilities
        };
    }    

    async convertToHomey(c: CharacteristicMessage, v: any, capabilityOptions: any) {
        const control = getCharacteristicControl(c);

        const capability = this.getCapabilityByCharacteristicType(control.type);
        if (!capability) return undefined;
        const capabilityData = this.getCapabilityData(capability);
        if (!capabilityData) return undefined;

        const homeyType = capabilityData.type;
        const shType = this.getSprutHubTypeToHomey(c);

        var returnValue = this.getSprutHubValue(v);
       
        let homeyMin = capabilityOptions.min ?? capabilityData.min;
        let homeyMax = capabilityOptions.max ?? capabilityData.max;


        let shMin = control.minValue;
        let shMax = control.maxValue

        if (shMin !== undefined && shMax !== undefined && homeyMin !== undefined && homeyMax !== undefined) {
            returnValue = (Number(returnValue) - shMin) * ((homeyMax - homeyMin) / (shMax - shMin)) + homeyMin;
        }
        if (homeyType === shType) return returnValue;

        if (homeyType === "string" && shType === "number") return String(returnValue);
        if (homeyType === "number" && shType === "string") return Number(returnValue);
        if (homeyType === "number" && shType === "boolean") return Number(returnValue);
        if (homeyType === "boolean" && shType === "number") return Boolean(returnValue);
        if (homeyType === "boolean" && shType === "string") return Boolean(returnValue);
        if (homeyType === "string" && shType === "boolean") return String(returnValue);
        if (homeyType === 'enum') {
            let validValue = control.validValues?.find(validValue => {
                return Object.values(validValue.value)[0] === Object.values(v)[0]
            });
            if (validValue) return validValue.key;
        }
        return v;
    }

    async convertFromHomey(c: CharacteristicMessage, v: any, capabilityOptions: any) {
        const control = getCharacteristicControl(c);
        const capability = this.getCapabilityByCharacteristicType(control.type);
        if (!capability) return undefined;
        const capabilityData = this.getCapabilityData(capability);
        if (!capabilityData) return undefined;
        const shType = this.getSprutHubType(c);
        const homeyType = capabilityData.type;

        let convertedValue =  this.convertValueToSprutHub(v, c, capabilityData, capabilityOptions);
        
        if (homeyType === "string" && shType === "intValue") convertedValue = parseInt(String(convertedValue));
        if (homeyType === "string" && shType === "boolValue") convertedValue = Boolean(convertedValue);
        if (homeyType === "string" && shType === "doubleValue") convertedValue = parseFloat(String(convertedValue));

        if (homeyType === "number" && shType === "intValue") convertedValue = Math.floor((Number(convertedValue)));
        if (homeyType === "number" && shType === "boolValue") convertedValue = Boolean(convertedValue);
        if (homeyType === "number" && shType === "doubleValue") convertedValue = Number(convertedValue);

        if (homeyType === "boolean" && shType === "intValue") convertedValue = Number(convertedValue);
        if (homeyType === "boolean" && shType === "boolValue") convertedValue = Boolean(convertedValue);
        if (homeyType === "boolean" && shType === "doubleValue") convertedValue = Number(convertedValue);

        if (homeyType === 'enum') {
            let validValue = control.validValues?.find(validValue => validValue.key === v);
            if (validValue) return validValue.value;
        }

        return { [shType]: convertedValue }

    }

    convertValueToSprutHub(v: any, c: CharacteristicMessage, capabilityData: Capability, capabilityOptions: any) {

        const shType = this.getSprutHubType(c);
        const control = getCharacteristicControl(c);
        const homeyType = capabilityData.type;

        let homeyMin = capabilityOptions.min ?? capabilityData.min;
        let homeyMax = capabilityOptions.max ?? capabilityData.max;

        let shMin = control.minValue;
        let shMax = control.maxValue

        if (shMin !== undefined && shMax !== undefined && homeyMin !== undefined && homeyMax !== undefined) {
            return Math.floor((v - homeyMin) / (homeyMax - homeyMin) * (shMax - shMin) + shMin);
        }
        return v;
    }

    
    getSprutHubTypeToHomey(c: CharacteristicMessage) {
        let shType = this.getSprutHubType(c);
        switch (shType) {
            case "stringValue":
                return 'string';
            case "boolValue":
                return 'boolean';
            case "intValue":
                return 'number';
            case "doubleValue":
                return 'number';
            default:
                return undefined;
        }
    }

    getHomeyTypeToSprutHub(homeyType: String, c: CharacteristicMessage) {
    
    }

    getSprutHubType(c: CharacteristicMessage) {
        return Object.keys(getCharacteristicControl(c).value)[0];
    }
    
    getSprutHubValue(v: any) {
        return Object.values(v)[0]
    }

    getCapabilityByCharacteristicType(type: string) {
        return Object.keys(CAPABILITIES).find(c => CAPABILITIES[c as keyof typeof CAPABILITIES].includes(type));
    }

    getCapabilityData(capability: string) {
        const data =  capability in this.capabilities ? this.capabilities[capability] : undefined;
        return data
    }

    getCharacteristicOptions(characteristic: CharacteristicMessage): any {
        if (!getCharacteristicControl(characteristic).type) return {};
        let options = {};
        const control = getCharacteristicControl(characteristic);
        if (VALID_VALUES_TYPES.includes(control.type) && control.validValues) {
            let validValues = control.validValues
            ?.filter(value => value.checked)
            .map(value => ({id: value.key, title: value.name}));
            if (validValues) options = {values: validValues}
        }

        if (MIN_MAX_CONVERTED.includes(control.type)) {
            const minMax = {
                ...("minValue" in control) && {min: control.minValue},
                ...("maxValue" in control) && {max: control.maxValue},
                ...("minStep" in control) && {step: control.minStep}
            }
            options = {
                ...options,
                ...minMax
            }
        }
        // console.log(options);
        return options;
    }

    convertClass(a: AccessoryMessage) {

    }
}