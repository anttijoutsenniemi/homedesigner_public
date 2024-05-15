import axios from 'axios';
import furnitureStyles from '../furnitureStyleData/furnitureStyles.json';
import simpleStyles from '../furnitureStyleData/simplerStyles.json';
import singleFurnitureSimple from '../furnitureStyleData/singleFurnitureSimple.json';
import singleFurniture from '../furnitureStyleData/singleFurniture.json';
import dedent from 'dedent';

export const fetchDesignInterpretation = async (roomPic64 : string) => {
    try {
      //this is for testing, comment this return statement to enable Ai
      // return dedent`{
      //   "nonValidImage": false,
      //   "explanation": "Test explanation",
      //   "colorThemes": {
      //       "dark": false,
      //       "light": true,
      //       "colorful": false,
      //       "earthy": false,
      //       "blackAndWhite": false
      //   },
      //   "designStyles": {
      //       "industrial": false,
      //       "scandinavian": false,
      //       "minimalist": false,
      //       "modern": true,
      //       "farmhouse": false
      //   }
      // }`
      
      const apiKey = process.env.OPENAI_API_KEY;
      //const fillableJson = JSON.stringify(furnitureStyles);
      const fillableJson = JSON.stringify(furnitureStyles);
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          //model: "gpt-4-turbo",
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
              {
                  type: "text",
                  text: dedent`Could you help me find furniture that would match the interior in the given image? I will give you a JSON where 
                        you can fill true on the color and/or style value that you think would be applicable to furniture that fit the space. 
                        in the explanation key you can fill in your reasoning as to why furniture with chosen color and style values would fit.
                        If the image is something else than interior design please only fill nonValidImage key as true. Fill this JSON and return
                        it only: ${fillableJson}`
              },
              {
                  type: "image_url",
                  image_url: {
                    url: `${roomPic64}`
                    //url: "https://images.tori.fi/api/v1/imagestori/images/100261082365.jpg?rule=medium_660",
                  },
              },
              ],
            },
          ],
          max_tokens: 1000,
          response_format: { type: "json_object" }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      )
      //console.log(result.data.choices[0].message.content);
      let answer = result.data.choices[0].message.content;
      return answer;
    } catch (error) {
      console.log("Error occured getting ai response: ", error);
      return false
    } 
};

export const fetchInterPretationWithReference = async (refPic64 : string) => {
  try {
    //this is for testing, comment this return statement to enable Ai
    // return dedent`{
    //   "nonValidImage": false,
    //   "explanation": "Test explanation",
    //   "colorThemes": {
    //       "dark": false,
    //       "light": true,
    //       "colorful": false,
    //       "earthy": false,
    //       "blackAndWhite": false,
    //   },
    //   "designStyles": {
    //       "industrial": false,
    //       "scandinavian": false,
    //       "minimalist": false,
    //       "modern": true,
    //       "farmhouse": false
    //   }
    // }`
    
    const apiKey = process.env.OPENAI_API_KEY;
    //const fillableJson = JSON.stringify(furnitureStyles);
    const fillableJson = JSON.stringify(furnitureStyles);
    const result = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        //model: "gpt-4-turbo",
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
            {
                type: "text",
                text: dedent`Could you help me find furniture that would match the style / design in the given reference image? I will give you a JSON where 
                      you can fill true on the color and/or style value that you think would be applicable to furniture that fit the vibe in the reference image. 
                      in the explanation key you can fill in your reasoning as to why furniture with chosen color and style values would fit.
                      If the image is something else than interior design or reference image please only fill nonValidImage key as true. Fill this JSON and return
                      it only: ${fillableJson}`
            },
            {
                type: "image_url",
                image_url: {
                  url: `${refPic64}`
                  //url: "https://images.tori.fi/api/v1/imagestori/images/100261082365.jpg?rule=medium_660",
                },
            },
            ],
          },
        ],
        max_tokens: 1000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
    //console.log(result.data.choices[0].message.content);
    let answer = result.data.choices[0].message.content;
    return answer;
  } catch (error) {
    console.log("Error occured getting ai response: ", error);
    return false
  } 
};

export const fetchInterpretationWithBothImg = async (roomPic64 : string, refPic64 : string) => {
  try {
    //this is for testing, comment this return statement to enable Ai
    // return dedent`{
    //   "nonValidImage": false,
    //   "explanation": "Test explanation",
    //   "colorThemes": {
    //       "dark": false,
    //       "light": true,
    //       "colorful": false,
    //       "earthy": false,
    //       "blackAndWhite": false,
    //   },
    //   "designStyles": {
    //       "industrial": false,
    //       "scandinavian": false,
    //       "minimalist": false,
    //       "modern": true,
    //       "farmhouse": false
    //   }
    // }`
    
    const apiKey = process.env.OPENAI_API_KEY;
    //const fillableJson = JSON.stringify(furnitureStyles);
    const fillableJson = JSON.stringify(furnitureStyles);
    const result = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        //model: "gpt-4-turbo",
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
            {
              type: "text",
              text: dedent`Could you help me find furniture that would match the style / design in the given images? First I will give you an image of the
                    room where these new furniture would be placed and the second image is a reference image of the kind of style I am looking for. I will give you a JSON where 
                    you can fill true on the color and/or style value that you think would be applicable to furniture that fit the vibe in the images. 
                    In the explanation key you can fill in your reasoning as to why furniture with chosen color and style values would the room and the reference image.
                    If some of the images are something else than interior design or reference image please only fill nonValidImage key as true. Fill this JSON and return
                    it only: ${fillableJson}`
            },
            {
              type: "image_url",
              image_url: {
                url: `${roomPic64}`
              },
            },
            {
              type: "image_url",
              image_url: {
                url: `${refPic64}`
              },
            },
            ],
          },
        ],
        max_tokens: 1000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
    //console.log(result.data.choices[0].message.content);
    let answer = result.data.choices[0].message.content;
    return answer;
  } catch (error) {
    console.log("Error occured getting ai response: ", error);
    return false
  } 
};

export const fetchStyleForSingleFurniture = async (furniturePicUrl : string) => {
  try {
    //this is for testing, comment this return statement to enable Ai
    // return dedent`{
    //   "colorThemes": {
    //       "dark": false,
    //       "light": true,
    //       "colorful": false,
    //       "earthy": false,
    //       "blackAndWhite": false
    //   },
    //   "designStyles": {
    //       "industrial": false,
    //       "scandinavian": false,
    //       "minimalist": false,
    //       "modern": true,
    //       "farmhouse": false
    //   }
    // }`
    
    const apiKey = process.env.OPENAI_API_KEY;
    //const fillableJson = JSON.stringify(furnitureStyles);
    const fillableJson = JSON.stringify(singleFurniture);
    const result = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        //model: "gpt-4-turbo",
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
            {
                type: "text",
                text: dedent`Could you help me to make an estimation on the color themes and style values of the furniture in this image?
                      I will give you a JSON where you can fill in true/false on the color themes and style values that you think describe
                      the furniture the best. Fill this JSON and return it only: ${fillableJson}`
            },
            {
                type: "image_url",
                image_url: {
                  url: `${furniturePicUrl}`
                  //url: "https://images.tori.fi/api/v1/imagestori/images/100261082365.jpg?rule=medium_660",
                },
            },
            ],
          },
        ],
        max_tokens: 1000,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    )
    let answer = result.data.choices[0].message.content;
    return answer;
  } catch (error) {
    console.log("Error occured getting ai response: ", error);
    return false
  } 
};