import axios from 'axios';

export const fetchDesignInterpretation = async (roomPic64 : string) => { 
    try {
        const response = await axios.post('/airoute/room', { roomPic64: roomPic64 });
        console.log('Server response:', response.data);
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
        return false;
      }
}

export const fetchInterPretationWithReference = async (refPic64 : string) => {
    try {
        const response = await axios.post('/airoute/ref', { refPic64: refPic64 });
        console.log('Server response:', response.data);
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
        return false;
      }
}

export const fetchInterpretationWithBothImg = async (roomPic64 : string, refPic64 : string) => { 
    try {
        const response = await axios.post('/airoute/both', { roomPic64: roomPic64, refPic64: refPic64 });
        console.log('Server response:', response.data);
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
        return false;
      }
}