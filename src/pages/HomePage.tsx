import React from 'react';
import {Deal} from '../types';
import {SpoteraPlayfulHero} from '../components/SpoteraPlayfulHero';
import {PlacesPhotoSection} from '../components/PlacesPhotoSection';
import {FeaturedDealsSection} from '../components/FeaturedDealsSection';
export const HomePage:React.FC<{onClaimCoupon:(d:Deal)=>void;onBookNow:(d:Deal)=>void}>=()=> <div className="paper-home"><SpoteraPlayfulHero/><PlacesPhotoSection/><div className="paper-home-deals"><FeaturedDealsSection/></div><aside className="paper-end-note">Your next great day is just around the corner. <span>♡</span></aside></div>;
