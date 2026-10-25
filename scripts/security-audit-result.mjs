export function summarizeAudit(result) {
  let parsed;
  try { parsed=JSON.parse(result.stdout??''); } catch { return {executed:false,status:'unavailable',reason:'Audit returned no valid JSON',vulnerabilities:null}; }
  const counts=parsed.metadata?.vulnerabilities;
  if(result.error||result.signal||parsed.error||!counts||!['low','moderate','high','critical'].every(key=>Number.isInteger(counts[key])&&counts[key]>=0)){
    return {executed:false,status:'unavailable',reason:'Audit execution or registry request failed',vulnerabilities:null};
  }
  if(result.status!==0&&result.status!==1)return {executed:false,status:'unavailable',reason:'Audit exited unexpectedly',vulnerabilities:null};
  const blocking=counts.high>0||counts.critical>0;
  if(result.status!==0&&!blocking)return {executed:false,status:'unavailable',reason:'Audit failed without a matching high/critical finding',vulnerabilities:null};
  return {executed:true,status:blocking?'review_required':'passed',vulnerabilities:counts};
}
