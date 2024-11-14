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
    }

    handleLocationToggle = e => {
        if (!e.currentTarget.checked) {
            return;
        }

        navigator.geolocation.getCurrentPosition(this.handleLocation, this.handleError, LOCATION_OPTIONS);
    }

    handleLocation = ({ coords }) => {
        console.log(coords);
    }

    handleError = err => console.error(err);
}

const locationFetcher = new LocationFetcher();