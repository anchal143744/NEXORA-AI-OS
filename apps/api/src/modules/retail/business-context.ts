export const businessDetailFields=['address','businessPhone','businessEmail','website','sells','buys','taxRegistration','invoiceStyle','invoiceTerms'] as const;
export function detailsPatch(input:object){const values=input as Record<string,unknown>;return Object.fromEntries(businessDetailFields.flatMap(field=>typeof values[field]==='string'?[[field,(values[field] as string).trim()]]:[])) as Record<string,string>;}
export function catalogueWords(search:string){return search.trim().split(/\s+/).filter(Boolean).slice(0,12);}
