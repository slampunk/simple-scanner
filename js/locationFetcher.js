import { getDistanceBetweenCoordinates } from "./utils.js";

const LOCATION_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 5000
}

const ACKERMANS_LOCATIONS = [
    {
        id: '',
        province: 'Gauteng',
        name: 'Maponya Mall',
        latitude: -26.258284333327477,
        longitude: 27.902450653216185
    },
    {
        id: '',
        province: 'Gauteng',
        name: 'Mams Mall',
        latitude: -25.70108524630234,
        longitude: 28.421082126556662
    },
    {
        id: '',
        province: 'Gauteng',
        name: 'Mall of Africa',
        latitude: -26.01504741646336,
        longitude: 28.107101125227246
    },
    {
        id: '',
        province: 'Gauteng',
        name: 'Randburg Cresta',
        latitude: -26.129782666134602,
        longitude: 27.974771155863003
    }
]

class LocationFetcher {
    targetElement = null;

    constructor() {
        document.getElementById('locationToggle').addEventListener('change', this.handleLocationToggle);
        [ ...document.querySelectorAll('input[name=channel]') ].forEach(input => input.addEventListener('input', this.handleChannelChange));
        [ ...document.querySelectorAll('input[name=province]') ].forEach(input => input.addEventListener('input', this.handleProvinceChange));
        [ ...document.querySelectorAll('input[name=store]') ].forEach(input => input.addEventListener('input', this.handleStoreChange));
    }

    handleLocationToggle = e => {
        if (!e.currentTarget.checked) {
            return;
        }

        document.querySelector('.location-button').classList.add('location-toggled');

        navigator.geolocation.getCurrentPosition(this.handleLocation, this.handleError, LOCATION_OPTIONS);
    }

    handleLocation = ({ coords }) => {
        const closestAckermans = ACKERMANS_LOCATIONS
            .map(l => ({ ...l, distance: getDistanceBetweenCoordinates(coords, l) }))
            .sort((a, b) => a.distance - b.distance)[0];

        const provinceInput = [ ...document.querySelectorAll('input[name=province]') ]
            .find(input => input.value === closestAckermans.province);
        const storeInput = [ ...document.querySelectorAll('input[name=store]') ]
            .find(input => input.value === closestAckermans.name);

        if (provinceInput) {
            provinceInput.checked = true;
        }

        if (storeInput) {
            storeInput.checked = true;
        }

        document.querySelector('.location-button').classList.remove('location-toggled');
    }

    handleError = err => {
        console.error(err);
        document.querySelector('.location-button').classList.remove('location-toggled');
    }

    handleChannelChange = e => {
        if (e.currentTarget.id === 'ackermans') {
            [ ...document.querySelectorAll('[data-option="ackermans"] input[type=radio]')]
                .forEach(input => input.setAttribute('required', true));
            document.querySelector('input[name=isa-code]').setAttribute('required', true);
        }
        else {
            [ ...document.querySelectorAll('[data-option="ackermans"] input[type=radio]')]
                .forEach(input => input.removeAttribute('required'));
                document.querySelector('input[name=isa-code]').removeAttribute('required', true);
        }

        document.getElementById('channelDropdown').checked = false;
    }

    handleProvinceChange = e => {
        document.getElementById('provinceDropdown').checked = false;
    }

    handleStoreChange = e => {
        document.getElementById('storeDropdown').checked = false;
    }
}

const locationFetcher = new LocationFetcher();