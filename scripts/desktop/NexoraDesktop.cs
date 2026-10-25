using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net.Http;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

[assembly:AssemblyTitle("NEXORA AI")]
[assembly:AssemblyProduct("NEXORA AI")]
[assembly:AssemblyVersion("1.9.0.0")]
[assembly:AssemblyFileVersion("1.9.0.0")]

// No host objects, web messages, Node bridge, arbitrary process command or
// certificate-error override is exposed to web content.
internal static class NexoraDesktop {
  internal static readonly string Folder=AppDomain.CurrentDomain.BaseDirectory;
  internal static string Root, Node;
  [STAThread] static void Main() {
    try {
      string[] configuration=File.ReadAllLines(Path.Combine(Folder,"desktop.conf"));
      if(configuration.Length!=2) throw new Exception("Invalid desktop installation configuration.");
      Root=Path.GetFullPath(configuration[0]); Node=configuration[1];
      if(!Directory.Exists(Root)||!Path.IsPathRooted(Node)||!File.Exists(Node)||!Path.GetFileName(Node).Equals("node.exe",StringComparison.OrdinalIgnoreCase)) throw new Exception("NEXORA runtime paths are unavailable. Repair the verified installation.");
      string identity;
      using(var hash=SHA256.Create()) identity=BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(Root.ToUpperInvariant()))).Replace("-","").Substring(0,24);
      using(var mutex=new Mutex(false,"Local\\NEXORA_Desktop_"+identity)) {
        bool acquired; try { acquired=mutex.WaitOne(0); } catch(AbandonedMutexException) { acquired=true; }
        if(!acquired) { MessageBox.Show("NEXORA is already open or shutting down. Select its existing window from the taskbar.","NEXORA"); return; }
        try {
          // User-scoped environment flags must not enable remote debugging or
          // replace the runtime in a release host. This does not change OS policy.
          foreach(string name in new[]{"WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS","WEBVIEW2_BROWSER_EXECUTABLE_FOLDER","WEBVIEW2_USER_DATA_FOLDER","WEBVIEW2_PIPE_FOR_SCRIPT_DEBUGGER","WEBVIEW2_RELEASE_CHANNELS","WEBVIEW2_CHANNEL_SEARCH_KIND"}) Environment.SetEnvironmentVariable(name,null,EnvironmentVariableTarget.Process);
          Application.EnableVisualStyles(); Application.SetCompatibleTextRenderingDefault(false);
          Application.Run(new BusinessWindow(identity));
        } finally { mutex.ReleaseMutex(); }
      }
    } catch(Exception) { MessageBox.Show("NEXORA could not initialize its desktop installation. Check the installed paths and Microsoft WebView2 Runtime. Your database was not reset.","NEXORA",MessageBoxButtons.OK,MessageBoxIcon.Error); Environment.ExitCode=1; }
  }

  internal static async Task<string> Runtime(string script,int timeout) {
    var text=new StringBuilder();
    var info=new ProcessStartInfo(Node,"\""+Path.Combine(Root,"scripts",script)+"\"") { WorkingDirectory=Root,UseShellExecute=false,CreateNoWindow=true,RedirectStandardOutput=true,RedirectStandardError=true,StandardOutputEncoding=Encoding.UTF8,StandardErrorEncoding=Encoding.UTF8 };
    info.EnvironmentVariables.Remove("NODE_OPTIONS"); info.EnvironmentVariables.Remove("NODE_INSPECT_RESUME_ON_START");
    return await Task.Run(delegate {
      using(var process=new Process {StartInfo=info}) {
        DataReceivedEventHandler handler=delegate(object sender,DataReceivedEventArgs args) { if(args.Data!=null) lock(text) text.AppendLine(args.Data); };
        process.OutputDataReceived+=handler; process.ErrorDataReceived+=handler;
        if(!process.Start()) throw new Exception("Runtime start failed.");
        process.BeginOutputReadLine(); process.BeginErrorReadLine();
        if(!process.WaitForExit(timeout)) { process.Kill(); throw new Exception("Runtime command timed out. Services may still be stopping; check the local shutdown receipt."); }
        process.WaitForExit();
        // Runtime already redacts logs. Never put its output (which can include
        // installation paths or provider errors) in native exception dialogs.
        if(process.ExitCode!=0) throw new Exception("Runtime command failed. Check .local/desktop-server.log in the existing workspace.");
        return text.ToString();
      }
    });
  }

  internal static Task VerifyRuntime() {
    return Task.Run(delegate {
      using(var expected=Assembly.GetExecutingAssembly().GetManifestResourceStream("Nexora.NodeHash"))
      using(var reader=new StreamReader(expected))
      using(var algorithm=SHA256.Create())
      using(var input=File.OpenRead(Node)) {
        string digest=BitConverter.ToString(algorithm.ComputeHash(input)).Replace("-","");
        if(!digest.Equals(reader.ReadToEnd().Trim(),StringComparison.OrdinalIgnoreCase)) throw new Exception("Node runtime integrity mismatch.");
      }
      using(var stream=Assembly.GetExecutingAssembly().GetManifestResourceStream("Nexora.RuntimeHashes"))
      using(var reader=new StreamReader(stream))
      using(var sha=SHA256.Create()) {
        string line; int count=0;
        while((line=reader.ReadLine())!=null) {
          if(line.Length<66||line[64]!='\t') throw new Exception("Invalid embedded runtime manifest.");
          string relative=line.Substring(65),file=Path.GetFullPath(Path.Combine(Root,relative));
          if(Path.IsPathRooted(relative)||!file.StartsWith(Root.TrimEnd(Path.DirectorySeparatorChar)+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase)) throw new Exception("Invalid runtime file path.");
          using(var input=File.OpenRead(file)) {
            string digest=BitConverter.ToString(sha.ComputeHash(input)).Replace("-","");
            if(!digest.Equals(line.Substring(0,64),StringComparison.OrdinalIgnoreCase)) throw new Exception("Runtime integrity mismatch.");
          }
          count++;
        }
        if(count<10) throw new Exception("Runtime manifest is incomplete.");
      }
    });
  }
}

internal sealed class BusinessWindow:Form {
  WebView2 view=new WebView2();
  readonly Label status=new Label();
  readonly Button retry=new Button();
  readonly System.Windows.Forms.Timer heartbeat=new System.Windows.Forms.Timer();
  readonly HttpClient health=new HttpClient(new HttpClientHandler {UseProxy=false,AllowAutoRedirect=false});
  readonly string identity;
  Task startup,recovery;
  Uri origin;
  bool closing,closed,recovering,checking,started,recreateBrowser;
  int failures;
  public BusinessWindow(string appIdentity) {
    identity=appIdentity; Text="NEXORA AI"; Icon=new Icon(Path.Combine(NexoraDesktop.Folder,"NEXORA.ico"));
    ClientSize=new Size(1400,900); MinimumSize=new Size(1000,680); StartPosition=FormStartPosition.CenterScreen;
    BackColor=Color.FromArgb(11,20,38); ForeColor=Color.White; Font=new Font("Segoe UI",10);
    status.Dock=DockStyle.Top; status.Height=46; status.TextAlign=ContentAlignment.MiddleLeft; status.Padding=new Padding(18,0,0,0); status.Text="Starting your private workspace…";
    retry.Text="Retry connection"; retry.Dock=DockStyle.Bottom; retry.Height=38; retry.Visible=false; retry.FlatStyle=FlatStyle.Flat;
    retry.Click+=async delegate { recovery=Recover(); await recovery; };
    view.Dock=DockStyle.Fill; view.Visible=false; Controls.Add(view); Controls.Add(status); Controls.Add(retry);
    health.Timeout=TimeSpan.FromSeconds(3); heartbeat.Interval=10000;
    heartbeat.Tick+=async delegate { await CheckHealth(); };
    Shown+=delegate { startup=Start(); };
    FormClosing+=CloseSafely;
    FormClosed+=delegate {heartbeat.Dispose();health.Dispose();view.Dispose();};
  }
  async Task Start() {
    try {
      CoreWebView2Environment.GetAvailableBrowserVersionString();
      status.Text="Verifying your application files…";
      await NexoraDesktop.VerifyRuntime();
      if(closing) return;
      started=true;
      string output=await NexoraDesktop.Runtime("desktop-launch.mjs",170000);
      string address=null; foreach(string line in output.Split('\n')) if(line.StartsWith("READY:")) address=line.Substring(6).Trim();
      Uri target;
      if(!Uri.TryCreate(address,UriKind.Absolute,out target)||target.Scheme!="http"||!target.IsLoopback||target.UserInfo!=""||target.AbsolutePath!="/login") throw new Exception("Invalid local runtime address.");
      origin=new Uri(target.GetLeftPart(UriPartial.Authority));
      if(closing) return;
      string profile=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"NEXORA","WebView2",identity);
      var options=new CoreWebView2EnvironmentOptions(); options.ReleaseChannels=CoreWebView2ReleaseChannels.Stable;
      var environment=await CoreWebView2Environment.CreateAsync(null,profile,options);
      await view.EnsureCoreWebView2Async(environment);
      var core=view.CoreWebView2; var settings=core.Settings;
      settings.AreHostObjectsAllowed=false; settings.IsWebMessageEnabled=false;
      settings.AreDevToolsEnabled=false; settings.AreDefaultContextMenusEnabled=false;
      settings.IsStatusBarEnabled=false; settings.IsPasswordAutosaveEnabled=false; settings.IsGeneralAutofillEnabled=false;
      core.NavigationStarting+=delegate(object sender,CoreWebView2NavigationStartingEventArgs args) { if(!Allowed(args.Uri)) args.Cancel=true; };
      core.FrameNavigationStarting+=delegate(object sender,CoreWebView2NavigationStartingEventArgs args) { if(!Allowed(args.Uri)) args.Cancel=true; };
      core.NewWindowRequested+=delegate(object sender,CoreWebView2NewWindowRequestedEventArgs args) { args.Handled=true; if(Allowed(args.Uri)) core.Navigate(args.Uri); };
      core.LaunchingExternalUriScheme+=delegate(object sender,CoreWebView2LaunchingExternalUriSchemeEventArgs args) {args.Cancel=true;};
      core.PermissionRequested+=delegate(object sender,CoreWebView2PermissionRequestedEventArgs args) { args.State=CoreWebView2PermissionState.Deny; };
      core.ServerCertificateErrorDetected+=delegate(object sender,CoreWebView2ServerCertificateErrorDetectedEventArgs args) {args.Action=CoreWebView2ServerCertificateErrorAction.Cancel;};
      core.ProcessFailed+=delegate(object sender,CoreWebView2ProcessFailedEventArgs args) {
        if(args.ProcessFailedKind==CoreWebView2ProcessFailedKind.BrowserProcessExited) recreateBrowser=true;
        if(args.ProcessFailedKind==CoreWebView2ProcessFailedKind.GpuProcessExited||args.ProcessFailedKind==CoreWebView2ProcessFailedKind.UtilityProcessExited) return;
        Offline("The embedded browser stopped. Retry to recover your saved workspace.");
      };
      core.NavigationCompleted+=delegate(object sender,CoreWebView2NavigationCompletedEventArgs args) { if(!args.IsSuccess) Offline("This page could not load. Retry the local connection."); };
      // Keep the normal WebView2 download/save UI; do not write paths from JS.
      core.DownloadStarting+=delegate(object sender,CoreWebView2DownloadStartingEventArgs args) {if(!Allowed(core.Source)) args.Cancel=true;};
      failures=0; view.Enabled=true; view.Visible=true; retry.Visible=false; status.Visible=false; core.Navigate(target.AbsoluteUri); heartbeat.Start();
    } catch(Exception) { Offline("NEXORA could not start. Check WebView2, local database connectivity and .local/desktop-server.log. No data was reset."); }
  }
  bool Allowed(string value) {
    Uri uri; return origin!=null&&Uri.TryCreate(value,UriKind.Absolute,out uri)&&uri.Scheme==origin.Scheme&&uri.Host.Equals(origin.Host,StringComparison.OrdinalIgnoreCase)&&uri.Port==origin.Port&&uri.UserInfo.Length==0;
  }
  void Offline(string message) { if(closing||IsDisposed) return; status.Text=message; status.Visible=true; retry.Visible=true; view.Enabled=false; }
  async Task CheckHealth() {
    if(closing||checking||recovering||origin==null) return; checking=true;
    try { using(var response=await health.GetAsync(new Uri(origin,"/api/v1/health/live"))) { if(response.IsSuccessStatusCode) {failures=0;return;} } }
    catch(HttpRequestException) {} catch(TaskCanceledException) {}
    finally {checking=false;}
    if(++failures>=3) Offline("The local services are unavailable. Retry to reconnect; saved records remain in PostgreSQL.");
  }
  async Task Recover() {
    if(closing||recovering) return; recovering=true; retry.Enabled=false; status.Text="Reconnecting to your saved workspace…";
    try {
      await NexoraDesktop.VerifyRuntime();
      await NexoraDesktop.Runtime("desktop-stop.mjs",55000);
      if(closing) return;
      await NexoraDesktop.Runtime("desktop-launch.mjs",170000); started=true;
      if(closing) return;
      if(recreateBrowser) {
        Controls.Remove(view);view.Dispose();view=new WebView2 {Dock=DockStyle.Fill,Visible=false};
        Controls.Add(view);view.SendToBack();recreateBrowser=false;
      }
      if(view.CoreWebView2==null) { await Start(); return; }
      failures=0; view.Enabled=true; view.Visible=true; retry.Visible=false; status.Visible=false; view.CoreWebView2.Reload();
    } catch(Exception) { Offline("Recovery failed. Check .local/desktop-server.log, then retry. No data was reset."); }
    finally {recovering=false;if(!IsDisposed) retry.Enabled=true;}
  }
  async void CloseSafely(object sender,FormClosingEventArgs args) {
    if(closed) return; args.Cancel=true; if(closing) return;
    closing=true; heartbeat.Stop(); retry.Enabled=false; view.Enabled=false; status.Visible=true; status.Text="Closing NEXORA safely…";
    try { if(startup!=null) await startup; if(recovery!=null) await recovery; if(started) await NexoraDesktop.Runtime("desktop-stop.mjs",55000); }
    catch(Exception) {MessageBox.Show(this,"NEXORA could not confirm graceful shutdown. The database was not stopped or reset. Check the local shutdown receipt before reopening.","NEXORA shutdown",MessageBoxButtons.OK,MessageBoxIcon.Warning);}
    finally {closed=true;Close();}
  }
}
