import {PaperWordmark} from './Navbar';
import React from 'react';
export const BrandMark=({className='',onClick}:{className?:string;onClick?:()=>void})=><div className={className} onClick={onClick}><PaperWordmark/></div>;
