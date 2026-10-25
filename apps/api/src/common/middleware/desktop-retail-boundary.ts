import type {Request,Response,NextFunction} from 'express';
const id='[0-9a-fA-F-]{36}';
const paths: Record<string,RegExp[]> = {
  GET: [ new RegExp('^/api/v1/retail/shop/documents/'+id+'$'),new RegExp('^/api/v1/retail/shop/sales/'+id+'/invoice$'), /^\/api\/v1\/health\/live$/, /^\/api\/v1\/auth\/(me|contexts)$/, /^\/api\/v1\/retail\/shop\/(settings|overview|sales|customers|follow-ups|products|expenses|documents)$/, new RegExp(`^/api/v1/retail/shop/products/${id}/movements$`), /^\/api\/v1\/retail\/(sales|reports\/profit-loss)$/, new RegExp(`^/api/v1/finance/invoices/${id}/payments$`) ],
  POST: [new RegExp('^/api/v1/retail/lead-intake/'+id+'$'), /^\/api\/v1\/auth\/(signup|login|refresh|logout|contexts|switch-context|forgot-password|reset-password|password\/change|email\/request-verification|email\/verify)$/, /^\/api\/v1\/retail\/shop\/(setup|customers|follow-ups|products|expenses|documents|signature|follow-up-draft|lead-import|lead-connection)$/, /^\/api\/v1\/retail\/(sales|stock-movements)$/, new RegExp(`^/api/v1/retail/sales/${id}/(complete|returns|cancel)$`), new RegExp(`^/api/v1/finance/invoices/${id}/(payments|refunds)$`) ],
  PATCH: [ /^\/api\/v1\/retail\/shop\/(settings|preferences)$/, new RegExp(`^/api/v1/retail/shop/(customers|follow-ups|products)/${id}$`) ],
};
export function isDesktopRetailRoute(method:string,url:string){
  const pathname=url.split('?')[0].replace(/\/$/,'');
  return (paths[method==='HEAD'?'GET':method]??[]).some(rule=>rule.test(pathname));
}
// This limits desktop exposure; endpoint authentication, tenant ownership and
// transaction permissions remain mandatory inside the allowed controllers.
export function desktopRetailBoundary(request:Request,response:Response,next:NextFunction){
  if(isDesktopRetailRoute(request.method,request.originalUrl)){next();return;}
  response.status(404).json({statusCode:404,message:'This endpoint is unavailable in the NEXORA retail desktop application.'});
}
