import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {gzipSync} from 'node:zlib';
import {z} from 'zod';
const require=createRequire(import.meta.url);
const express=require('express'),bodyParser=require('body-parser'),multer=require('multer');

async function serve(t,app){
  const server=app.listen(0,'127.0.0.1');
  await new Promise((resolve,reject)=>{server.once('listening',resolve);server.once('error',reject);});
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  return 'http://127.0.0.1:'+server.address().port;
}

test('compressed JSON and form parsing reject trailing corruption and keep serving healthy requests',async t=>{
  const app=express();app.use(bodyParser.json({limit:'8kb'}));app.use(bodyParser.urlencoded({extended:true,limit:'8kb'}));
  app.post('/body',(req,res)=>res.json(req.body));app.get('/health',(req,res)=>res.send('ok'));
  app.use((err,req,res,next)=>res.status(err.status||400).send('invalid body'));
  const base=await serve(t,app);
  for(const [type,text]of [['application/json','{"name":"synthetic"}'],['application/x-www-form-urlencoded','name=synthetic']]){
    const valid=await fetch(base+'/body',{method:'POST',headers:{'content-type':type,'content-encoding':'gzip'},body:gzipSync(text),signal:AbortSignal.timeout(5000)});
    assert.equal(valid.status,200);assert.deepEqual(await valid.json(),{name:'synthetic'});
    const invalid=await fetch(base+'/body',{method:'POST',headers:{'content-type':type,'content-encoding':'gzip'},body:Buffer.concat([gzipSync(text),Buffer.from('invalid trailing frame')]),signal:AbortSignal.timeout(5000)});
    assert.equal(invalid.status,400);await invalid.body?.cancel();
    const healthy=await fetch(base+'/health',{signal:AbortSignal.timeout(5000)});assert.equal(await healthy.text(),'ok');
  }
});

test('multipart async filter rejection tolerates an already pending callback without killing the server',async t=>{
  const app=express();let pending,callbackReturned=false;
  const upload=multer({storage:multer.memoryStorage(),limits:{files:2,fileSize:1024},fileFilter(req,file,callback){
    if(file.fieldname==='pending'){pending=callback;return;}
    assert.ok(pending,'First file must already have a pending filter');
    callback(new Error('Synthetic upload rejection'));
    setImmediate(()=>{pending(null,true);callbackReturned=true;});
  }}).any();
  app.post('/upload',upload,(req,res)=>res.send('accepted'));
  app.get('/health',(req,res)=>res.send('ok'));app.use((err,req,res,next)=>res.status(400).send('rejected'));
  const base=await serve(t,app),boundary='nexora-security-fixture';
  const part=name=>'--'+boundary+'\r\nContent-Disposition: form-data; name="'+name+'"; filename="synthetic.txt"\r\nContent-Type: text/plain\r\n\r\nsynthetic\r\n';
  const response=await fetch(base+'/upload',{method:'POST',headers:{'content-type':'multipart/form-data; boundary='+boundary},body:part('pending')+part('reject')+'--'+boundary+'--\r\n',signal:AbortSignal.timeout(5000)});
  assert.equal(response.status,400);await response.body?.cancel();
  await new Promise(resolve=>setImmediate(resolve));assert.equal(callbackReturned,true);
  const healthy=await fetch(base+'/health',{signal:AbortSignal.timeout(5000)});assert.equal(await healthy.text(),'ok');
});

test('oversized constrained Zod collections reject before accumulating element errors',()=>{
  const schema=z.array(z.number()).max(2);
  const invalid=schema.safeParse(Array(1000).fill('invalid'));
  assert.equal(invalid.success,false);assert.equal(invalid.error.issues.length,1);assert.equal(invalid.error.issues[0].code,'too_big');
  assert.deepEqual(schema.parse([1,2]),[1,2]);
});

test('mail address comments cannot replace the intended envelope recipient',async()=>{
  const nodemailer=require('nodemailer');
  // streamTransport creates MIME/envelope locally; no email is transmitted.
  const transport=nodemailer.createTransport({streamTransport:true,buffer:true});
  const result=await transport.sendMail({from:'sender@example.invalid',to:'Customer (x(y) <other@example.invalid>) <customer@example.invalid>',subject:'Synthetic parser test',text:'Synthetic'});
  assert.deepEqual(result.envelope.to,['customer@example.invalid']);transport.close();
});

test('URI tooling rejects encoded schemes while retaining ordinary schema references',()=>{
  const uri=require('fast-uri');const invalid=uri.parse('java%73cript:alert(1)');
  assert.ok(invalid.error);assert.notEqual(invalid.scheme,'javascript');
  assert.equal(uri.resolve('https://example.invalid/schemas/base.json','child.json'),'https://example.invalid/schemas/child.json');
});
