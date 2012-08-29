<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="aidantest" generation="1" functional="0" release="0" Id="c9b483eb-91c6-463b-8d37-d6152c2d7d02" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="aidantestGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="WorkerRole1:HttpIn" protocol="tcp">
          <inToChannel>
            <lBChannelMoniker name="/aidantest/aidantestGroup/LB:WorkerRole1:HttpIn" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="WorkerRole1Instances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/aidantest/aidantestGroup/MapWorkerRole1Instances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:WorkerRole1:HttpIn">
          <toPorts>
            <inPortMoniker name="/aidantest/aidantestGroup/WorkerRole1/HttpIn" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapWorkerRole1Instances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/aidantest/aidantestGroup/WorkerRole1Instances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="WorkerRole1" generation="1" functional="0" release="0" software="C:\node\chatapp\local_package.csx\roles\WorkerRole1" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="HttpIn" protocol="tcp" portRanges="442" />
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
            <sCSPolicyIDMoniker name="/aidantest/aidantestGroup/WorkerRole1Instances" />
            <sCSPolicyFaultDomainMoniker name="/aidantest/aidantestGroup/WorkerRole1FaultDomains" />
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
    <implementation Id="d3993d86-765e-49f7-af73-1330d08afa13" ref="Microsoft.RedDog.Contract\ServiceContract\aidantestContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="179974fa-021d-4298-b96a-bddf8e258562" ref="Microsoft.RedDog.Contract\Interface\WorkerRole1:HttpIn@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/aidantest/aidantestGroup/WorkerRole1:HttpIn" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>