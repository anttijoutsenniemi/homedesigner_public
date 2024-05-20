import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ImageCapture from './components/ImageCapture';
import Modal from './components/Modal';
import { fetchDesignInterpretation, fetchInterPretationWithReference, fetchInterpretationWithBothImg } from './components/VisionHandler';
import { fetchSeatingData, fetchTablesData } from './components/ApiFetches';
import { TailSpin } from 'react-loader-spinner';
import chairMap from './assets/json/chairMap.json';
import tableMap from './assets/json/tableMap.json';

export interface ChatMessage {
  id: number;
  type: 'user' | 'chatbot';
  text: string;
  options?: string[]; // Only present if type is 'chatbot'
  image64?: string[] | boolean;
  imageModeRoom?: boolean; //when user is taking pic of room
  imageModeRef?: boolean; //when user is choosing reference pic for style
}

export interface ChatOption {
  label: string;
}

interface AiData {
  nonValidImage: boolean;
  explanation: string;
  colorThemes: {
      dark: boolean;
      light: boolean;
      colorful: boolean;
      earthy: boolean;
      blackAndWhite: boolean;
      pastel: boolean;
      neutrals: boolean;
      jewelTones: boolean;
      metallics: boolean;
      oceanic: boolean;
  };
  designStyles: {
      industrial: boolean;
      scandinavian: boolean;
      minimalist: boolean;
      modern: boolean;
      farmhouse: boolean;
      artDeco: boolean;
      bohemian: boolean;
      traditional: boolean;
      rustic: boolean;
      glam: boolean;
      contemporary: boolean;
      transitional: boolean;
  };
}

interface FurnitureData {
  _id: any;
  id: number;
  picUrl: string;
  title: string;
  productUrl: string;
  deleted: boolean;
  styleJson: {
      colorThemes: {
          dark: boolean;
          light: boolean;
          colorful: boolean;
          earthy: boolean;
          blackAndWhite: boolean;
          pastel: boolean;
          neutrals: boolean;
          jewelTones: boolean;
          metallics: boolean;
          oceanic: boolean;
      };
      designStyles: {
          industrial: boolean;
          scandinavian: boolean;
          minimalist: boolean;
          modern: boolean;
          farmhouse: boolean;
          artDeco: boolean;
          bohemian: boolean;
          traditional: boolean;
          rustic: boolean;
          glam: boolean;
          contemporary: boolean;
          transitional: boolean;
      };
  };
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Initial chat messages and options
    { id: 1, type: 'chatbot', text: 'Welcome! I am your Homedesigner assistant, lets find furniture that matches your style together!', options: ['Help me find suitable furniture for my home.'] },
  ]);
  const [furnitureClass, setFurnitureClass] = useState<string>('Chairs');
  const [roomImage64, setRoomImage64] = useState<string | null>(null);
  const [refImage64, setRefImage64] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiJson, setAiJson] = useState<any>(false);
  const messageEnd = useRef<HTMLDivElement>(null);
  const [recommendations, setRecommendations] = useState<FurnitureData[]>(); 
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const scrollToBottom = () => {
    messageEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateImage = (img64 : string, roomImage : boolean) => {
    //conditional to see if user sends image of room or reference image
    if(roomImage){
      setRoomImage64(img64);
      setTimeout(() => { //timeout to let rendering happen first before autoscroll
        scrollToBottom();
      }, 50);
      
    }
    else{
      setRefImage64(img64);
      setTimeout(() => { //timeout to let rendering happen first before autoscroll
        scrollToBottom();
      }, 50);
    }
  }

  //function for uploading image/images to correct aiprompt in VisionHandler.tsx
  const uploadImage = async (img64 : string, roomMode : boolean, refMode? : boolean, refImage? : string) => {
    try {
      let aiJson : any = false;
      setLoading(true);
      if(roomMode && refMode && refImage){
        aiJson = await fetchInterpretationWithBothImg(img64, refImage);
      }
      else if(roomMode){
        aiJson = await fetchDesignInterpretation(img64);
      }
      else{
        aiJson = await fetchInterPretationWithReference(img64);
      }
      if(aiJson){
        let parsedJson = JSON.parse(aiJson);

        if(parsedJson.nonValidImage){
          handleOptionClick('Invalid images');
        }
        else{
          let jsonMap : FurnitureData[] = [];
          if(furnitureClass === 'Chairs'){
            jsonMap = await fetchSeatingData();
          }
          else if(furnitureClass === 'Tables'){
            jsonMap = await fetchTablesData();
          }

          let recommendations = getBestMatches(parsedJson, jsonMap);
          setRecommendations(recommendations);
          let imageArray : string[] = [];
          for(let i = 0; i < recommendations.length; i++){
            let title : string = recommendations[i].picUrl;
            imageArray.push(title);
          }
          let botAnswer : string = parsedJson.explanation + ' Here are some recommendations that I think match the style you are looking for, click the images to open more options: ';
          //console.log("botanswr: ", botAnswer, "truevlaues: ", trueValues, "images: ", imageArray);
          setLoading(false);
          handleOptionClick('Show recommendations', botAnswer, imageArray);
        }
      }
      else{
        setLoading(false);
        handleOptionClick('Error occured');
      }
    } catch (error) {
      setLoading(false);
      handleOptionClick('Error occured');
      console.log(error);
    }
    
  }

  //this function is tied to getBestMatches
  const getMatchScore = (criteria: AiData, item: FurnitureData): number => {
    let score = 0;

    const { colorThemes, designStyles } = criteria;
    const itemColorThemes = item.styleJson.colorThemes;
    const itemDesignStyles = item.styleJson.designStyles;

    (Object.keys(colorThemes) as (keyof typeof colorThemes)[]).forEach(key => {
      if (colorThemes[key] && itemColorThemes[key]) {
          score++;
      }
    });

    (Object.keys(designStyles) as (keyof typeof designStyles)[]).forEach(key => {
        if (designStyles[key] && itemDesignStyles[key]) {
            score++;
        }
    });

    return score;
}

//this function finds the 10 best matches from db data that have similar style values to what the ai has repsonded with
const getBestMatches = (criteria: AiData, items: FurnitureData[]): FurnitureData[] => {
    const scoredItems = items.map(item => ({
        item,
        score: getMatchScore(criteria, item)
    }));

    // Sort items by score in descending order
    scoredItems.sort((a, b) => b.score - a.score);

    // Filter out items with a score of 0
    const matchedItems = scoredItems.filter(scoredItem => scoredItem.score > 0);

    // If no matches are found, return the first 10 items
    if (matchedItems.length === 0) {
        return items.slice(0, 10);
    }

    // Return top 10 or fewer items
    return matchedItems.slice(0, 10).map(scoredItem => scoredItem.item);
}


  //this function is for redirecting user to threed app
  const redirectToThreedWithParams = (furnitureId : string) => {
    if(typeof(furnitureId) === 'string' && furnitureId.length < 20){
      window.location.href = `/threedroute?id=${furnitureId}`; // Redirects the user to the 3D app when both apps are hosted in same server with a query parameter
    }
    else{
      window.location.href = `/threedroute?id=1`;
      console.log('Invalid query parameter, sending default parameter of 1');
    }
  }

  // Function to handle option click, send next options and paste next user and bot message
  const handleOptionClick = (option : string, botAnswer? : string, images? : string[]) => {
    const newUserMessage: ChatMessage = { id: messages.length + 1, type: 'user', text: option };

    let botResponseText : string = 'I am not coded that far yet';  // Default response text
    let options : string[] = [];
    let imageModeRoom : boolean = false;
    let imageModeRef : boolean = false;
    let image64 : string[] | boolean = false; 
    switch (option) {
        case 'Help me find suitable furniture for my home.':
            botResponseText = 'Great! What type of furniture are you looking for? Here are some categories to choose from:';
            options = ['Chairs', 'Tables'];
            break;
        case 'Chairs':
            setFurnitureClass('Chairs');
            botResponseText = 'Sure, lets find a chair to your liking. Do you want to take a picture of the room so I can suggest chairs that I think fit the space?';
            options = ['Yes I can take a picture of the room', 'Not this time thank you', 'Give me chair suggestions that I can browse'];
            break;
        case 'Tables':
            setFurnitureClass('Tables');
            botResponseText = 'Sure, lets find a table to your liking. Do you want to take a picture of the room so I can suggest chairs that I think fit the space?';
            options = ['Yes I can take a picture of the room', 'Not this time thank you', 'Give me table suggestions that I can browse'];
            break;
        case 'Yes I can take a picture of the room':
            botResponseText = 'Do you also want to add a reference picture that I can look at for inspiration?';
            options = ['Yes I can also add a reference picture', 'No I dont want to also add a reference picture'];
            break;
        case 'Not this time thank you':
            botResponseText = 'Do you want to add a reference picture that I can look at for inspiration?';
            options = ['Yes I can add a reference picture', 'No I dont want to add a reference picture'];
            break;
        case 'Yes I can also add a reference picture':
            imageModeRoom = true;
            imageModeRef = true;
            break;
        case 'No I dont want to also add a reference picture':
            imageModeRoom = true;
            break;
        case 'Yes I can add a reference picture':
            imageModeRef = true;
            break;
        case 'No I dont want to add a reference picture':
            if(furnitureClass === 'Tables'){
              //here recommend tables
            }
            else if(furnitureClass === 'Chairs'){
              //here recommend chairs
            }
            options = ['Start again'];
            break;
        case 'Give me chair suggestions that I can browse':
            //code for giving chair suggestions
            options = ['Start again'];
            break;
        case 'Give me table suggestions that I can browse':
            //code for giving table suggestions
            options = ['Start again'];
            break;
        case 'Error occured':
            botResponseText = 'Error occured fetching AI response';
            options = ['Start again'];
            break;
        case 'Invalid images':
            botResponseText = 'The image/images you posted does not seem to be applicable for interior design. Please provide me with valid images.';
            options = ['Start again'];
            break;
        case 'Show recommendations':
            if(botAnswer && images){
              botResponseText = botAnswer;
              image64 = images
            }
            else{
              botResponseText = 'Error occured fetching AI response';
            }
            options = ['Start again'];
            break;
        case 'Start again':
            botResponseText = 'Welcome! I am your Homedesigner assistant, lets find furniture that matches your style together!';
            options = ['Help me find suitable furniture for my home.'];
            break;
        default:
            botResponseText = 'I didnt understand your selection.';
            options = ['Start again'];
            break;
    }

    const newBotMessage: ChatMessage = {
        id: messages.length + 2,
        type: 'chatbot',
        text: botResponseText,
        options: options,
        image64: image64,
        imageModeRoom: imageModeRoom,
        imageModeRef: imageModeRef
    };

    setMessages([...messages, newUserMessage, newBotMessage]);
};

  return (
    <div className="chat-app-background">
      <div className="chat-wrapper">
      {messages.map((message) => (
      <div key={message.id} className={`chat-message ${message.type}`}>
        {(message.type === 'chatbot')
          ? //sender is chatbot
            (Array.isArray(message.image64))
            ? //paste recommendedation images
            <div className='chat-content'>
              <img src="/icon.png" alt="Chatbot" className="chatbot-profile" />
              <div>
                <div className="chat-bubble" style={{marginBottom:'10px'}}>{message.text}</div>
                {
                  message.image64.map((imageUri, index) => (
                    (furnitureClass === 'Chairs')
                    ?
                    <div key={index}>
                      <button onClick={() => openModal()}>
                        <img src={`${imageUri}`} alt='Furniture recommendation'/>
                      </button>
                      <Modal title='Select form options below' isOpen={modalOpen} onClose={closeModal}/>
                    </div>
                    // <a key={index} href={`/threedroute/?id=chair`}>
                    //   <img src={`/furnitureImages/chairs/${imageUri}`} alt='Furniture recommendation'/>
                    // </a>
                    :
                    <a key={index} href={`/threedroute/?id=table`}>
                    <img src={`${imageUri}`} alt='Furniture recommendation'/>
                    </a>
                  ))
                }
                {
                  (message.options && message.id === messages.length) //only render options on the last message so user cant click previous options
                  ? 
                  <>
                    <div className="chat-options" ref={messageEnd}>
                      {message.options.map((option, index) => (
                        <button key={index} onClick={() => handleOptionClick(option)}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                  : null
                }
              </div>
            </div>
            :
            (message.imageModeRoom || message.imageModeRef)
            ? 
              (message.imageModeRoom && message.imageModeRef)
              ? //paste both ref and image room compos
                <div style={{flexDirection: 'column'}}>
                  <p style={{marginBottom: 5}}>Add picture of room</p>
                  <ImageCapture room={true} reference={false} updateImage={updateImage}/>
                  {roomImage64 && 
                    <>
                      <img src={roomImage64} alt="Captured" style={{marginTop: 10, marginBottom: 10}}/>
                    </>
                  }
                  <p style={{marginBottom: '5px'}}>Add reference picture</p>
                  <ImageCapture room={false} reference={true} updateImage={updateImage}/>
                  <div ref={messageEnd}></div>
                  {refImage64 && roomImage64 &&
                  <>
                    <img src={refImage64} alt="Captured" style={{marginTop: 10, marginBottom: 10}}/>
                    <div ref={messageEnd}>
                    <button className='upload-image-button' onClick={() => uploadImage(roomImage64, true, true, refImage64)}>Send both images</button>
                    </div>
                  </>
                  }
                  {loading && <TailSpin color="#00BFFF" height={80} width={80} />}
                </div>
              :
                //paste chatbot image message
                (message.imageModeRoom)

                ? //paste room image compo
                <div style={{flexDirection: 'column'}}>
                  <ImageCapture room={true} reference={false} updateImage={updateImage}/>
                  {roomImage64 && 
                    <>
                      <img src={roomImage64} alt="Captured" style={{marginTop: 10, marginBottom: 10}}/>
                      <div>
                      <button className='upload-image-button' onClick={() => uploadImage(roomImage64, true)}>Send Image</button>
                      </div>
                    </>
                  }
                  {loading && <TailSpin color="#00BFFF" height={80} width={80} />}
                  <div ref={messageEnd}></div>
                </div>

                : //paste reference image compo
                <div style={{flexDirection: 'column'}}>
                  <ImageCapture room={false} reference={true} updateImage={updateImage}/>
                  {refImage64 &&
                  <>
                    <img src={refImage64} alt="Captured" style={{marginTop: 10, marginBottom: 10}}/>
                    <div>
                    <button className='upload-image-button' onClick={() => uploadImage(refImage64, false)}>Send Image</button>
                    </div>
                  </>
                  }
                  {loading && <TailSpin color="#00BFFF" height={80} width={80} />}
                  <div ref={messageEnd}></div>
                </div>

            : //paste normal chatbot message
            <div className="chat-content">
              <img src="/icon.png" alt="Chatbot" className="chatbot-profile" />
              <div>
                <div className="chat-bubble" >{message.text}</div>
                {
                  (message.options && message.id === messages.length) //only render options on the last message so user cant click previous options
                  ? 
                  <>
                    <div className="chat-options" ref={messageEnd}>
                      {message.options.map((option, index) => (
                        <button key={index} onClick={() => handleOptionClick(option)}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                  : null
                }
              </div>
            </div> 

          : //sender is user
          <div className="chat-content">
            <div className="chat-bubble">{message.text}</div>
          </div>
        }
  
      </div>
    ))}
      
      </div>
    </div>
  );
};

export default App;
