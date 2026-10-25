import React from 'react';
import {Deal} from '../types';
import {SpoteraPlayfulHero} from '../components/SpoteraPlayfulHero';
import {PlacesPhotoSection} from '../components/PlacesPhotoSection';
import {FeaturedDealsSection} from '../components/FeaturedDealsSection';
import {useApp} from '../context/AppContext';
import {homepageLayout} from '../utils/homepageLayout';
export const HomePage:React.FC<{onClaimCoupon:(d:Deal)=>void;onBookNow:(d:Deal)=>void}>=()=> {
 const {homepageConfig}=useApp();
 return <div className="paper-home">{homepageLayout(homepageConfig.sections).map(section=><React.Fragment key={section.id}>{section.id==='hero'?<SpoteraPlayfulHero/>:section.id==='categories'?<PlacesPhotoSection/>:<div className="paper-home-deals"><FeaturedDealsSection/></div>}</React.Fragment>)}<aside className="paper-end-note">Your next great day is just around the corner. <span>♡</span></aside></div>;
};
