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
    rotation_speed: ["RotationSpeed"],
    measure_tvoc: ["VOCDensity"]
};

export const CUSTOM_CAPABILITIES: {
    [capability: string]: string[]
} = {
    // button: ["ProgrammableSwitchEvent"],
    // measure_angle: ["C_Angle"],
    // measure_aqi: ["C_AQIDensity"],
    // measure_atmospheric_pressure: ["C_CurrentAtmosphericPressure"],
    // measure_cubic_meter: ["C_CubicMeter"],
    // measure_formaldehyde: ["C_FormaldehydeDensity"],
    // measure_frequency: ["C_Frequency"],
    // measure_kvah: ["C_KiloVoltAmpereHour"],
    // measure_kvarh: ["C_KiloVoltAmpereReactiveHour"],
    // measure_motion_level: ["C_CurrentMotionLevel"],
    // measure_power_factor: ["C_PowerFactor"],
    // measure_pulse_count: ["C_PulseCount"],
    // measure_so2: ["SulphurDioxideDensity"],
    // measure_va: ["C_VoltAmpere"],
    // measure_var: ["C_VoltAmpereReactive"],
    // measure_water_level: ["WaterLevel"],
    // alarm_active: ["StatusActive"],
    // alarm_fault: ["StatusFault"],
    // alarm_jammed: ["StatusJammed"],
    // alarm_noise: ["C_NoiseDetected"]
};

export const CAPABILITIES = { ...HOMEY_CAPABILITIES, ...CUSTOM_CAPABILITIES };

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

export const DEVICE_ICON: {
    [icon: string]: string[]
} = {
    '915005987001': ['915005987001'],
    '929003053101': ['929003053101'],
    '3402831P7': ['3402831P7'],
    'LCA001': ['LCA001'],
    'LCG002': ['LCG002', '345lm'],

    'ikea_remote': ['TRADFRI remote control'],
    'ikea_on_off': ['TRADFRI on/off switch'],
    'aqara_fp': ['AS074', 'AS037'],
    'aqara_leak': ['AS010'],
    'aqara_l350': ['AL018'],
    'aqara_mx480': ['XL006'],
    'aqara_mx960': ['XL004'],
    'aqara_spotlight_t3': ['AL115'],
    'aqara_light_t2': ['AL186'],
    'aqara_led_driver': ['AL010'],
    'zhimi.airfresh.va2': ['zhimi.airfresh.va2', 'zhimi.airfresh.va4'],
    'aqara_relay': ['AU001', 'AK027'],
    'aqara_thermostat_e1': ['AA006'],
    'aqara_temp': ['AS008', 'WSDCGQ11LM'],
    'aqara_p2_contact': ['AS039', 'MCCGQ13LM'],
    'aqara_contact': ['AS006', 'MCCGQ11LM'],
    'aqara_motion': ['RTCGQ13LM', 'RTCGQ11LM'],
    'aqara_wierless': ['WXKG12LM', 'AR001'],
    'aqara_smoke': ['JTYJ-GD-01LM'],
    'aqara_plug_round': [],// need import
    'aqara_plug_sq': [],// need import
    'VINDSTYRKA': ['VINDSTYRKA'],
    'INSPELNING': ['INSPELNING'],
    'thermostat': ['Cool.stick']
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

    getStringValue(servive: ServiceMessage | undefined, type: string) {
        return servive?.characteristics?.find(c => c.control?.type === type)?.control?.value.stringValue
    }

    accessoryIcon(accessoryMessage: AccessoryMessage): string | undefined { 
        const lowerModelId = accessoryMessage.modelId.toLowerCase();


        const accessoryInfo = accessoryMessage?.services?.find(s => s.type === 'AccessoryInformation');
        const lowerModel = this.getStringValue(accessoryInfo, "Model").toLowerCase();;

        // console.log(lowerModel);

        const iconKey = Object.keys(DEVICE_ICON).find(key => 
            DEVICE_ICON[key].some(value => {
                return lowerModel.includes(value.toLowerCase()) || value.toLowerCase() === lowerModel || lowerModelId.includes(value.toLowerCase()) || value.toLowerCase() === lowerModelId
             })
        );
        if (iconKey) {
            // console.log('***', iconKey);
            return '../../../assets/icons/' + iconKey + '.svg';
        }
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