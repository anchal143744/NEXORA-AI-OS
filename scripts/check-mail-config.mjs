import {loadLocalDevelopmentEnv} from './local-development-env.mjs';
const env=loadLocalDevelopmentEnv(),provider=env.EMAIL_PROVIDER??'smtp';
const required=provider==='smtp'?['EMAIL_FROM','SMTP_HOST','SMTP_USER','SMTP_PASS']:provider==='resend'?['EMAIL_FROM','RESEND_API_KEY']:provider==='sendgrid'?['EMAIL_FROM','SENDGRID_API_KEY']:[];
if(!required.length){console.error('EMAIL_PROVIDER must be smtp, resend or sendgrid. No email was sent.');process.exitCode=1;}
else {
  const missing=required.filter(key=>!env[key]?.trim());
  console.log(JSON.stringify({provider,enabled:env.EMAIL_DELIVERY_ENABLED==='true',missingFields:missing,valuesWithheld:true,emailSent:false},null,2));
  if(env.EMAIL_DELIVERY_ENABLED!=='true'||missing.length)process.exitCode=1;
  else console.log('Required fields are present. Inbox delivery still requires a provider acceptance/delivery test; presence is not proof of delivery.');
}
