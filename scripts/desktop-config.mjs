export function desktopAddresses(env){
  const webPort=Number(env.NEXORA_WEB_PORT??3000),apiPort=Number(env.PORT??4000);
  if(![webPort,apiPort].every(port=>Number.isInteger(port)&&port>0&&port<=65535)||webPort===apiPort)throw new Error('Configure distinct valid local NEXORA ports');
  let address;try{address=new URL(env.NEXORA_API_INTERNAL_URL);}catch{throw new Error('Desktop API URL is missing or malformed; its value is withheld');}
  if(address.protocol!=='http:'||!['localhost','127.0.0.1','[::1]'].includes(address.hostname)||address.username||address.password||address.search||address.hash||address.pathname!=='/'||Number(address.port||80)!==apiPort)throw new Error('Desktop API must use plain HTTP loopback and match the configured local PORT, without credentials or extra URL components');
  return {front:`http://localhost:${webPort}`,api:address.origin};
}

export function desktopRuntimeEnvironment(env){
  if(env.NODE_TLS_REJECT_UNAUTHORIZED==='0')throw new Error('NEXORA desktop refuses disabled TLS certificate validation');
  const clean={...env};
  // A desktop app must not inherit debugger, preload or runtime-injection flags
  // from the publishing shell or a local environment file.
  delete clean.NODE_OPTIONS;delete clean.NODE_INSPECT_RESUME_ON_START;
  return clean;
}
