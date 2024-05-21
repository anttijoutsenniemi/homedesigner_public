import axios from 'axios';

export const fetchDesignInterpretation = async (roomPic64 : string) => { 
    try {
        const response = await axios.post('/airoute/room', { roomPic64: roomPic64 });
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}

export const fetchInterPretationWithReference = async (refPic64 : string) => {
    try {
        const response = await axios.post('/airoute/ref', { refPic64: refPic64 }, {
          auth: {
              username: process.env.REACT_APP_HTTP_BASIC_AUTH_USERNAME!,
              password: process.env.REACT_APP_HTTP_BASIC_AUTH_PASSWORD!
          }
      });
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}

export const fetchInterpretationWithBothImg = async (roomPic64 : string, refPic64 : string) => { 
    try {
        const response = await axios.post('/airoute/both', { roomPic64: roomPic64, refPic64: refPic64 },{
          auth: {
              username: process.env.REACT_APP_HTTP_BASIC_AUTH_USERNAME!,
              password: process.env.REACT_APP_HTTP_BASIC_AUTH_PASSWORD!
          }
      });
        return response.data;
      } catch (error) {
        console.error('There was an error!', error);
      }
}