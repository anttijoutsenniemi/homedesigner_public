import axios from 'axios';

export const fetchTablesData = async () => {
  //this return is for testing, comment to enable real ai feature
  // return [{
  //   _id: '663e313e8000fc342013bd85',
  //   id: 1,
  //   picUrl: 'https://fargovintage.fi/cdn/shop/files/DSC08391-2.jpg?v=1715152335&width=4000',
  //   title: 'Sohvapöytä, David Hicks, 70-luku',
  //   productUrl: 'https://fargovintage.fi/en/collections/tables/products/sohvapoyta-david-hicks-70-luku',
  //   deleted: false,
  //   styleJson: {
  //     colorThemes: {
  //       dark: false,
  //       light: false,
  //       colorful: false,
  //       earthy: false,
  //       blackAndWhite: false
  //     },
  //     designStyles: {
  //       industrial: false,
  //       scandinavian: false,
  //       minimalist: true,
  //       modern: true,
  //       farmhouse: false
  //     }
  //   }
  // }]
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