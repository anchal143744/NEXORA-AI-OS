export type ContactRow={name:string;phone?:string;email?:string;company?:string};
export function parseContactCsv(text:string):ContactRow[]{
  if(text.length>128000)throw new Error('Import at most 128 KB / 50 contacts at a time.');
  const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
  const value=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
  for(let index=0;index<value.length;index++){const character=value[index];if(character==='"'){if(quoted&&value[index+1]==='"'){cell+='"';index++;}else quoted=!quoted;}else if(!quoted&&(character===','||character==='\n')){row.push(cell);cell='';if(character==='\n'){if(row.some(field=>field.trim()))rows.push(row);row=[];}}else cell+=character;}
  if(quoted)throw new Error('CSV has an unclosed quoted field.');row.push(cell);if(row.some(field=>field.trim()))rows.push(row);
  const headers=(rows.shift()??[]).map(header=>header.trim().toLowerCase().replace(/[^a-z0-9]/g,''));const column=(names:string[])=>names.map(name=>headers.indexOf(name)).find(index=>index>=0)??-1;
  const name=column(['name','fullname','displayname']),first=column(['firstname','givenname']),last=column(['lastname','familyname']),phone=column(['phone','mobile','telephone','phone1value']),email=column(['email','emailaddress','email1value']),company=column(['company','organization','organization1name']);
  if(name<0&&first<0)throw new Error('CSV needs a name or first name column. Supported columns: name, phone, email, company.');
  if(!rows.length||rows.length>50)throw new Error('Import 1–50 reviewed contacts at a time.');
  return rows.map(fields=>{const get=(index:number)=>index<0?'':(fields[index]??'').trim();const result={name:name>=0?get(name):[get(first),get(last)].filter(Boolean).join(' '),...(get(phone)?{phone:get(phone)}:{}),...(get(email)?{email:get(email)}:{}),...(get(company)?{company:get(company)}:{})};if(!result.name)throw new Error('Every contact needs a name.');return result;});
}
export function contactsCsv(rows:ContactRow[]){const cell=(value?:string)=>'"'+(value??'').replaceAll('"','""')+'"';return 'name,phone,email,company\n'+rows.map(row=>[row.name,row.phone,row.email,row.company].map(cell).join(',')).join('\n');}
