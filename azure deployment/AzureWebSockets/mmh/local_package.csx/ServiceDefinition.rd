<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="aidancasey123" generation="1" functional="0" release="0" Id="7494905f-f549-4e5f-8321-32f04d335bd8" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="aidancasey123Group" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="WorkerRole1:HttpIn" protocol="tcp">
          <inToChannel>
            <lBChannelMoniker name="/aidancasey123/aidancasey123Group/LB:WorkerRole1:HttpIn" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="WorkerRole1Instances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/aidancasey123/aidancasey123Group/MapWorkerRole1Instances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:WorkerRole1:HttpIn">
          <toPorts>
            <inPortMoniker name="/aidancasey123/aidancasey123Group/WorkerRole1/HttpIn" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapWorkerRole1Instances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/aidancasey123/aidancasey123Group/WorkerRole1Instances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="WorkerRole1" generation="1" functional="0" release="0" software="C:\Code\MassMobileHellucination\azure deployment\AzureWebSockets\mmh\local_package.csx\roles\WorkerRole1" entryPoint="base\x86\WaHostBootstrapper.exe" parameters="base\x86\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="HttpIn" protocol="tcp" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;WorkerRole1&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;WorkerRole1&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/aidancasey123/aidancasey123Group/WorkerRole1Instances" />
            <sCSPolicyFaultDomainMoniker name="/aidancasey123/aidancasey123Group/WorkerRole1FaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyFaultDomain name="WorkerRole1FaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="WorkerRole1Instances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="0c8e169c-89c2-47d7-a338-db24a1eb0167" ref="Microsoft.RedDog.Contract\ServiceContract\aidancasey123Contract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="7b615ec8-15da-4ad9-a3f2-80929626681f" ref="Microsoft.RedDog.Contract\Interface\WorkerRole1:HttpIn@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/aidancasey123/aidancasey123Group/WorkerRole1:HttpIn" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>