import axios from 'axios';

export const fetchTablesData = async () => { 
    try {
        const response = await axios.get('/apiroute/tables');
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}

export const fetchSeatingData = async () => {
    try {
        const response = await axios.get('/apiroute/seating');
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}