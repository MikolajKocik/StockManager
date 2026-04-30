import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const geocodingApi = {
    search: async (city: string, country: string): Promise<[number, number] | null> => {
        const query = `${city}, ${country}`;
        try {
            const res = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
                params: {
                    format: 'json',
                    q: query,
                    limit: 1
                }
            });
            
            if (res.data?.[0]) {
                return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
        return null;
    }
};
