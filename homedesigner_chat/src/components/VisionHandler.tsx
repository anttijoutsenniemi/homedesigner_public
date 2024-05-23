import axios from 'axios';

export const fetchDesignInterpretation = async (roomPic64 : string) => {
  //this return is for testing, comment to enable real ai feature
  // return '{ "nonValidImage": false, "explanation": "", "colorThemes": { "dark": false, "light": true, "colorful": false, "earthy": false, "blackAndWhite": false, "pastel": false, "neutrals": false, "jewelTones": false, "metallics": false, "oceanic": false }, "designStyles": { "industrial": true, "scandinavian": false, "minimalist": false, "modern": false, "farmhouse": false, "artDeco": false, "bohemian": false, "traditional": false, "rustic": false, "glam": false, "contemporary": false, "transitional": false } }'
    try {
        const response = await axios.post('/airoute/room', { roomPic64: roomPic64 }, {
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