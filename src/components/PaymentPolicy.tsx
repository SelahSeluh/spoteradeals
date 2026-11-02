import React from 'react';
import {paymentCopy} from '../utils/paymentPolicy';
export function PaymentPolicy({language}:{language:string}){return <p className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-xs leading-relaxed text-slate-700" dir={language==='ar'?'rtl':undefined}>{paymentCopy(language).policy}</p>}
