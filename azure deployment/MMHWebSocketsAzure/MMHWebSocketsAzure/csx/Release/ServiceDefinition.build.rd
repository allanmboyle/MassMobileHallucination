<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="MMHWebSocketsAzure" generation="1" functional="0" release="0" Id="d1ce6b7e-d797-4165-af44-1bb0e3c5fe84" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="MMHWebSocketsAzureGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="NodeWorkerRole:NodeHttp" protocol="tcp">
          <inToChannel>
            <lBChannelMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/LB:NodeWorkerRole:NodeHttp" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="NodeWorkerRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/MapNodeWorkerRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="NodeWorkerRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/MapNodeWorkerRoleInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:NodeWorkerRole:NodeHttp">
          <toPorts>
            <inPortMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/NodeWorkerRole/NodeHttp" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapNodeWorkerRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/NodeWorkerRole/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapNodeWorkerRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/NodeWorkerRoleInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="NodeWorkerRole" generation="1" functional="0" release="0" software="C:\Code\MassMobileHellucination\azure deployment\MMHWebSocketsAzure\MMHWebSocketsAzure\csx\Release\roles\NodeWorkerRole" entryPoint="base\x86\WaHostBootstrapper.exe" parameters="base\x86\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="NodeHttp" protocol="tcp" portRanges="8080" />
            </componentports>
            <settings>
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;NodeWorkerRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;NodeWorkerRole&quot;&gt;&lt;e name=&quot;NodeHttp&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/NodeWorkerRoleInstances" />
            <sCSPolicyFaultDomainMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/NodeWorkerRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyFaultDomain name="NodeWorkerRoleFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="NodeWorkerRoleInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="48dc9b59-c3ca-4baa-ba7f-f5b91970d53c" ref="Microsoft.RedDog.Contract\ServiceContract\MMHWebSocketsAzureContract@ServiceDefinition.build">
      <interfacereferences>
        <interfaceReference Id="dae12fd3-ed93-4b36-a487-3260d718ddde" ref="Microsoft.RedDog.Contract\Interface\NodeWorkerRole:NodeHttp@ServiceDefinition.build">
          <inPort>
            <inPortMoniker name="/MMHWebSocketsAzure/MMHWebSocketsAzureGroup/NodeWorkerRole:NodeHttp" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>