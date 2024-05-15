import React, { useState, useRef } from 'react';

interface ImageCaptureProps {
    updateImage: (img64 : string, roomImage : boolean) => void
    room: boolean,
    reference: boolean
}

const ImageCapture : React.FC<ImageCaptureProps> = (props) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if(props.room){
                    props.updateImage(reader.result as string, true);
                }
                else{
                    props.updateImage(reader.result as string, false);
                }
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
                capture="environment"
                onChange={handleCapture}
                style={{ display: 'none' }} // Hide the default input
            />
            <button onClick={handleClick} className="camera-button">Take/Upload Photo</button>
        </div>
    );
};

export default ImageCapture;