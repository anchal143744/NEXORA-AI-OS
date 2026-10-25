import net from 'node:net';
// Disposable SMTP receiver: captures synthetic fixture mail; never relays it.
export async function smtpReceiver(){
  const sockets=new Set(),messages=[];
  const server=net.createServer(socket=>{
    sockets.add(socket);socket.on('close',()=>sockets.delete(socket));socket.write('220 disposable-test ESMTP\r\n');
    let buffer='',data=false,body='';
    socket.on('data',chunk=>{buffer+=chunk.toString();let end;
      while((end=buffer.indexOf('\r\n'))>=0){
        const line=buffer.slice(0,end);buffer=buffer.slice(end+2);
        if(data){if(line==='.') {messages.push(body);data=false;body='';socket.write('250 accepted-test-message\r\n');}else body+=line+'\r\n';}
        else if(/^EHLO|^HELO/.test(line))socket.write('250-disposable-test\r\n250 SIZE 500000\r\n');
        else if(line==='DATA'){data=true;socket.write('354 End with dot\r\n');}
        else if(line==='QUIT')socket.end('221 Bye\r\n');
        else socket.write('250 OK\r\n');
      }
    });
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return {messages,port:server.address().port,async close(){for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));}};
}
