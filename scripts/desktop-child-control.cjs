// The parent owns this IPC channel. Trigger Next's existing asynchronous
// SIGTERM cleanup handlers instead of using Windows TerminateProcess.
let shuttingDown=false;
function shutdown(){
  if(shuttingDown)return;
  shuttingDown=true;
  if(process.listenerCount('SIGTERM'))process.emit('SIGTERM','SIGTERM');
  else process.exit(0);
}
process.on('message',message=>{
  if(!process.connected||message?.type!=='nexora:shutdown')return;
  shutdown();
});
// The service supervisor owns the channel. Do not leave an orphan server
// listening after that supervisor disappears unexpectedly.
if(process.channel)process.once('disconnect',shutdown);
