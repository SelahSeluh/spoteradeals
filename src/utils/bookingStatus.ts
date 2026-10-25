export function bookingPresentation(status:string){
 if(status==='cancelled')return {title:'Booking Cancelled',message:'This pass is cancelled and cannot be redeemed.',canRedeem:false};
 if(status==='redeemed'||status==='completed')return {title:'Pass Already Used',message:'This pass has already been redeemed.',canRedeem:false};
 if(status!=='confirmed')return {title:'Pass Unavailable',message:'This pass is not available for redemption.',canRedeem:false};
 return {title:'Booking Confirmed',message:'Your digital pass is ready for redemption',canRedeem:true};
}
