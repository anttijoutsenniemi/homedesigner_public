import React, { useState, useRef } from 'react';

interface ImageCaptureProps {
    updateImage: (img64 : string, roomImage : boolean) => void
    room: boolean,
    reference: boolean
}

const ImageCapture : React.FC<ImageCaptureProps> = (props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [useCamera, setUseCamera] = useState(true);

    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                props.updateImage(reader.result as string, props.room);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture={useCamera ? "environment" : undefined}
                onChange={handleCapture}
                style={{ display: 'none' }}
            />
            <div>
                <button
                    style={(useCamera) ? { backgroundColor: '#007778'} : { backgroundColor: 'grey' }}  
                    onClick={() => setUseCamera(true)} 
                    className="camera-button">Use Camera
                </button>
                <button 
                    style={(useCamera) ? { backgroundColor: 'grey' } : { backgroundColor: '#007778'}}
                    onClick={() => setUseCamera(false)} 
                    className="gallery-button">Use Gallery
                </button>
            </div>
            <button onClick={handleClick} className="upload-button">Take/Upload Photo</button>
        </div>
    );
};

export default ImageCapture;