const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

class GeocodingService {
    constructor() {
        this.mapToken = process.env.MAP_TOKEN;
        this.geocodingClient = mbxGeocoding({ accessToken: this.mapToken });
    }

    async getCoordinates(location) {
        try {
            const response = await this.geocodingClient.forwardGeocode({
                query: location,
                limit: 1,
            }).send();

            if (response.body.features && response.body.features.length > 0) {
                return response.body.features[0].geometry;
            }
            
            throw new Error('Location not found');
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new Error('Failed to get coordinates for location');
        }
    }

    async getLocationName(coordinates) {
        try {
            const response = await this.geocodingClient.reverseGeocode({
                query: coordinates,
                limit: 1,
            }).send();

            if (response.body.features && response.body.features.length > 0) {
                return response.body.features[0].place_name;
            }
            
            throw new Error('Coordinates not found');
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            throw new Error('Failed to get location name for coordinates');
        }
    }
}

module.exports = new GeocodingService();
