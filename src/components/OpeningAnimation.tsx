import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IntroAnimationConfig } from '../types';
import { Sun } from 'lucide-react';
interface OpeningAnimationProps { previewConfig?: IntroAnimationConfig; onPreviewClose?:()=>void; }
export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({previewConfig,onPreviewClose}) => {
 const {dismissOpeningAnimation}=useApp();
 useEffect(()=>{const timer=setTimeout(()=>{if(previewConfig&&onPreviewClose)onPreviewClose();else dismissOpeningAnimation()},2500);return ()=>clearTimeout(timer)},[dismissOpeningAnimation,previewConfig,onPreviewClose]);
 return <div className="sunshine-intro" role="status" aria-label="Welcome to SpoteraDeals"><Sun className="sunshine-intro-sun"/><div className="sunshine-wordmark">Spotera<span>Deals</span></div><p>Family adventures<br/>for a brighter UAE</p><button onClick={onPreviewClose||dismissOpeningAnimation}>Skip intro</button></div>;
};
