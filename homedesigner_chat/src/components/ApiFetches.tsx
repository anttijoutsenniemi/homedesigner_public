import axios from 'axios';

export const fetchTablesData = async () => {
    try {
        const response = await axios.get('/apiroute/tables', {
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

export const fetchSeatingData = async () => {
    try {
        const response = await axios.get('/apiroute/seating', {
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

export const checkUrl = async (url : string) => {
  try {
    const response = await axios.post('apiroute/checkUrl', 
    { url: url },
    {
      auth: {
        username: process.env.REACT_APP_HTTP_BASIC_AUTH_USERNAME!,
        password: process.env.REACT_APP_HTTP_BASIC_AUTH_PASSWORD!
      }
    });

    // Return true if the response status is in the range 200-299
    return response;
  } catch (error) {
    console.error('There was an error!', error);
    return false; // Return false if there's an error
  }
}