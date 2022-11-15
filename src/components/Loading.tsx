import React from "react";
import { Player } from '@lottiefiles/react-lottie-player';

interface Props {
    height? : string;
    animation? : string;
}
const Loading = ({height = '300px', animation = 'https://lottie.host/3188f2cb-3124-40c4-a47a-17fb9658d4dc/MBkafvCGT7.json'} : Props) =>{
    return(
        <Player 
            src={animation}
            background="transparent"
            speed={1}
            style={{width: '200px', height: height}}
            className="ml-auto mr-auto loading" loop autoplay></Player>
    )
}

export default Loading;