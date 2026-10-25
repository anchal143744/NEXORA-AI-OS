// Desktop sessions are served by the loopback gateway. A permissive development
// CORS fallback must not authorize unrelated websites on the local API.
export function desktopCorsOrigins(webPort: string | undefined) {
  const port=Number(webPort??3000);
  if(!Number.isInteger(port)||port<1||port>65535) throw new Error('Invalid desktop web port');
  return [`http://localhost:${port}`,`http://127.0.0.1:${port}`];
}
