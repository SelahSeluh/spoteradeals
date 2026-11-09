import React from 'react';
import {Wallet, Gift, ReceiptText, Sparkles, ArrowRight, Star} from 'lucide-react';
import {useApp} from '../context/AppContext';
import {PageTitle,useDesignText} from '../components/DesignPrimitives';
import {PaymentPolicy} from '../components/PaymentPolicy';

export function RewardsPage(){
  const {user,bookings,language,loyaltyTiers,isLoggedIn,setActiveView}=useApp();
  const d=useDesignText();
  const points=user.rewardsPoints||0;
  const credit=user.refundPoints||0;
  const threshold=Math.max(1,loyaltyTiers.vipThreshold||1000);
  const history=bookings.filter(b=>b.pointsCredited);
  const next=Math.max(0,threshold-points);
  return <section className="fn-narrow fn-wallet paper-picnic-rewards">
    <PageTitle title={language==='en'?'Play more. Earn more.':d('loyalty')} subtitle={language==='en'?'Collect points, unlock rewards and enjoy family perks.':d('tagline')}/>
    {!isLoggedIn&&<button className="fn-outline" onClick={()=>setActiveView('auth')}>{d('login')}</button>}
    <div className="paper-points-hero">
      <span className="paper-points-sparkle" aria-hidden="true">✳</span>
      <span className="paper-points-label">My points</span>
      <strong className="paper-points-total">{points.toLocaleString()}</strong>
      <span className="paper-points-caption">Collect points and enjoy more family perks</span>
      <div className="paper-points-progress" role="progressbar" aria-label="Points toward next reward" aria-valuemin={0} aria-valuemax={threshold} aria-valuenow={Math.min(points,threshold)}><span style={{width:`${Math.min(100,points/threshold*100)}%`}}/></div>
      <div className="paper-points-scale"><span>0</span><span>{threshold.toLocaleString()} points</span></div>
      <div className="paper-points-next"><Gift size={16}/>{next===0?'Your next reward level is unlocked!':`${next.toLocaleString()} points until your next reward level`}</div>
    </div>
    <div className="paper-points-actions"><button onClick={()=>setActiveView('explore')}><Star size={17}/> Explore rewards <ArrowRight size={16}/></button><button onClick={()=>setActiveView('bookings')}><Wallet size={17}/> My passes</button></div>
    <section className="paper-points-credit"><div className="paper-points-credit-icon"><Wallet size={21}/></div><div><h2>Available booking credit</h2><p>Credit issued as in-app points for eligible cancellations</p></div><strong>{credit.toLocaleString()} pts</strong></section>
    <section className="paper-points-activity"><h2><ReceiptText size={20}/> Points activity</h2>{history.length?<ul>{history.map(b=><li key={b.id}><span>{b.dealTitle}</span><strong>+{b.pointsCredited?.toLocaleString()} pts</strong></li>)}</ul>:<div className="paper-points-empty"><Sparkles size={26}/><p>Your points activity will appear here after qualifying bookings.</p></div>}</section>
    <PaymentPolicy language={language}/>
  </section>;
}
