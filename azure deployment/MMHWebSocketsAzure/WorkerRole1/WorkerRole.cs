using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace WorkerRole
{
    public class WorkerRole : RoleEntryPoint
    {
        Process proc;

        public override void Run()
        {
            proc.WaitForExit();
        }

        public override bool OnStart()
        {
            proc = new Process()
            {
                StartInfo = new ProcessStartInfo(
             //       Environment.ExpandEnvironmentVariables(@"%RoleRoot%approot\node.exe"), "app.js")
                    Environment.ExpandEnvironmentVariables(@"%RoleRoot%\approot\node.exe"), "app.js")

                {
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WorkingDirectory = Environment.ExpandEnvironmentVariables(@"%RoleRoot%\approot"),
                }
            };
            proc.Start();

            return base.OnStart();
        }
    }
}
