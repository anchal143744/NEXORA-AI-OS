using System;
using System.Drawing;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Threading;
using System.Windows.Forms;

internal static class NexoraLauncher {
  static string Folder = AppDomain.CurrentDomain.BaseDirectory;
  static string[] Settings;
  [STAThread] static void Main(string[] args) {
    try {
      using(var mutex = new Mutex(false,"Local\\NEXORA_Retail_Launcher")) {
        bool acquired;
        try { acquired=mutex.WaitOne(0); } catch(AbandonedMutexException) { acquired=true; }
        if(!acquired) { if(args.Length>0&&args[0]=="--verify")throw new Exception("NEXORA startup or upgrade is already in progress.");MessageBox.Show("NEXORA is already starting or updating. Please wait.","NEXORA");return; }
        try {
          LoadSettings();
          if(args.Length > 0 && args[0] == "--verify") {
        string url = Prepare(null);
        using(var icon = new Icon(Path.Combine(Folder,"NEXORA.ico"))) { if(icon.Width < 16) throw new Exception("Invalid logo icon"); }
        File.WriteAllText(Path.Combine(Folder,"verification.json"),"{\"launcher\":\"passed\",\"icon\":\"passed\",\"browserOpened\":false,\"url\":\""+url+"\",\"at\":\""+DateTime.UtcNow.ToString("o")+"\"}");
        return;
          }
        Application.EnableVisualStyles(); Application.SetCompatibleTextRenderingDefault(false);
        using(var splash = new Form()) {
          splash.Text="NEXORA"; splash.Icon=new Icon(Path.Combine(Folder,"NEXORA.ico")); splash.ClientSize=new Size(510,260); splash.BackColor=Color.FromArgb(11,20,38); splash.ForeColor=Color.FromArgb(236,239,255); splash.StartPosition=FormStartPosition.CenterScreen; splash.FormBorderStyle=FormBorderStyle.FixedSingle; splash.MaximizeBox=false;
          var logo=new PictureBox { Location=new Point(28,32),Size=new Size(62,62),SizeMode=PictureBoxSizeMode.Zoom,Image=Image.FromFile(Path.Combine(Folder,"NEXORA.png")) };
          var title=new Label { Location=new Point(108,30),Size=new Size(340,40),Text="NEXORA",Font=new Font("Segoe UI",25,FontStyle.Bold) };
          var subtitle=new Label { Location=new Point(111,77),Size=new Size(360,28),Text="Your business, connected.",ForeColor=Color.FromArgb(151,170,204),Font=new Font("Segoe UI",11) };
          var status=new Label { Location=new Point(30,143),Size=new Size(447,38),Text="Starting your private workspace…",Font=new Font("Segoe UI",10),ForeColor=Color.FromArgb(191,201,230) };
          var bar=new ProgressBar { Location=new Point(30,191),Size=new Size(447,8),Style=ProgressBarStyle.Marquee,MarqueeAnimationSpeed=25 };
          var foot=new Label { Location=new Point(30,218),Size=new Size(447,24),Text="Local database • no terminal commands needed",ForeColor=Color.FromArgb(115,138,177),Font=new Font("Segoe UI",8) };
          splash.Controls.AddRange(new Control[]{logo,title,subtitle,status,bar,foot});
          splash.Shown += delegate {
            var thread=new Thread(delegate() {
              try {
                string url=Prepare(delegate(string message) { if(!splash.IsDisposed) splash.BeginInvoke((Action)delegate {status.Text=message;}); });
                var start=new ProcessStartInfo(Settings[2],"--app=\""+url+"\" --user-data-dir=\""+Path.Combine(Folder,"browser-profile")+"\"") {UseShellExecute=true};
                Process.Start(start); // Visible app window is explicitly requested by the user.
                if(!splash.IsDisposed) splash.BeginInvoke((Action)delegate {splash.Close();});
              } catch(Exception error) {
                File.WriteAllText(Path.Combine(Folder,"launcher-error.txt"),error.Message);
                if(!splash.IsDisposed) splash.BeginInvoke((Action)delegate { MessageBox.Show(splash,error.Message+"\n\nYour data was not reset.","NEXORA could not open",MessageBoxButtons.OK,MessageBoxIcon.Warning);splash.Close(); });
              }
            }); thread.IsBackground=true;thread.Start();
          };
          Application.Run(splash);
        }
        } finally { mutex.ReleaseMutex(); }
      }
    } catch(Exception error) { if(args.Length > 0 && args[0] == "--verify") { File.WriteAllText(Path.Combine(Folder,"verification-error.txt"),error.Message);Environment.ExitCode=1; } else MessageBox.Show(error.Message,"NEXORA",MessageBoxButtons.OK,MessageBoxIcon.Error); }
  }
  static void LoadSettings() {
    Settings=File.ReadAllLines(Path.Combine(Folder,"launcher.conf"));
    if(Settings.Length!=3||!Directory.Exists(Settings[0])||!File.Exists(Settings[1])||!File.Exists(Settings[2]))throw new Exception("NEXORA installation paths are unavailable. Run desktop:install again.");
    string expectedFolder=Path.GetFullPath(Path.Combine(Settings[0],".local","desktop")).TrimEnd(Path.DirectorySeparatorChar);
    if(!Path.GetFullPath(Folder).TrimEnd(Path.DirectorySeparatorChar).Equals(expectedFolder,StringComparison.OrdinalIgnoreCase)
      ||!Path.IsPathRooted(Settings[1])||!Path.IsPathRooted(Settings[2])
      ||!Path.GetFileName(Settings[1]).Equals("node.exe",StringComparison.OrdinalIgnoreCase)
      ||!Path.GetFileName(Settings[2]).Equals("msedge.exe",StringComparison.OrdinalIgnoreCase))throw new Exception("NEXORA installation paths do not match this application. Reinstall a verified release.");
  }
  static string Prepare(Action<string> status) {
    var output=new StringBuilder();string url=null;
    var start=new ProcessStartInfo(Settings[1],"\""+Path.Combine(Settings[0],"scripts","desktop-launch.mjs")+"\"") {WorkingDirectory=Settings[0],UseShellExecute=false,CreateNoWindow=true,RedirectStandardOutput=true,RedirectStandardError=true,StandardOutputEncoding=Encoding.UTF8,StandardErrorEncoding=Encoding.UTF8};
    using(var process=new Process {StartInfo=start}) {
      DataReceivedEventHandler handler=delegate(object sender,DataReceivedEventArgs args) {
        if(args.Data==null)return;
        lock(output) { output.AppendLine(args.Data); if(args.Data.StartsWith("READY:"))url=args.Data.Substring(6); }
        if(status!=null&&args.Data.StartsWith("STARTING:"))status(args.Data.Substring(9));
        if(status!=null&&args.Data.StartsWith("REUSED:"))status("Opening your running workspace…");
      };
      process.OutputDataReceived+=handler;process.ErrorDataReceived+=handler;
      if(!process.Start())throw new Exception("Unable to start NEXORA runtime");process.BeginOutputReadLine();process.BeginErrorReadLine();
      if(!process.WaitForExit(160000)) {process.Kill();throw new Exception("Startup is taking longer than expected. See .local/desktop-server.log.");}
      process.WaitForExit();
      if(process.ExitCode!=0||url==null)throw new Exception(output.ToString().Trim());
    }
    Uri address;
    if(!Uri.TryCreate(url,UriKind.Absolute,out address)||address.Scheme!="http"||!address.IsLoopback||address.AbsolutePath!="/login")throw new Exception("Refusing an unexpected NEXORA address");
    return url;
  }
}
