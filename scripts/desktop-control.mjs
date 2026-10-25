import net from 'node:net';import {timingSafeEqual} from 'node:crypto';
export function createDesktopControl(pipe,token,onShutdown){
  if(!/^\\\\\.\\pipe\\nexora-[a-f0-9-]{36}$/.test(pipe)||!/^[a-f0-9]{64}$/.test(token))throw new Error('Invalid local desktop control configuration');
  const expected=Buffer.from(token);
  const server=net.createServer(socket=>{
    socket.setTimeout(3000,()=>socket.destroy());let input='';
    socket.on('error',()=>{});
    socket.on('data',chunk=>{
      input+=chunk.toString();if(input.length>2048){socket.destroy();return;}if(!input.includes('\n'))return;
      let request;try{request=JSON.parse(input.slice(0,input.indexOf('\n')));}catch{socket.end('denied\n');return;}
      const supplied=Buffer.from(typeof request.token==='string'?request.token:'');
      if(request.action!=='shutdown'||supplied.length!==expected.length||!timingSafeEqual(supplied,expected)){socket.end('denied\n');return;}
      socket.end('accepted\n');setImmediate(onShutdown);
    });
  });
  server.unref();return server;
}
export function requestDesktopShutdown(pipe,token){
  return new Promise((resolve,reject)=>{
    const socket=net.createConnection(pipe);let response='';
    socket.setTimeout(4000,()=>socket.destroy(new Error('Desktop control timed out')));
    socket.on('connect',()=>socket.write(JSON.stringify({action:'shutdown',token})+'\n'));
    socket.on('data',chunk=>{response+=chunk.toString();if(response.length>100)socket.destroy(new Error('Invalid desktop control response'));});
    socket.on('error',()=>reject(new Error('Desktop control is unavailable')));
    socket.on('end',()=>response.trim()==='accepted'?resolve():reject(new Error('Desktop control rejected shutdown')));
  });
}
