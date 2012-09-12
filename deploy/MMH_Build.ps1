
#Import-AzurePublishSettingsFile –PublishSettingsFile "C:/testdeploy/mysettings.publishsettings" 

$serviceName = "mme"

$workingFolder = "C:\test"
$pathToSource = "C:\Code\MassMobileHellucination"

cd $workingFolder

#Create Service Folder
New-AzureServiceProject $serviceName

#Add worker Role folder
Add-AzureNodeWorkerRole

$source = $pathToSource

$dest = $workingFolder + '\' + $serviceName + '\WorkerRole1'

$exclude = @('*.pdb','*.config')
Get-ChildItem $source -Recurse -Exclude $exclude | Copy-Item -Destination {Join-Path $dest $_.FullName.Substring($source.length)}

$fso = New-Object -ComObject scripting.filesystemobject

#clean up some duff folders...
$fso.DeleteFolder($dest + '\.idea')
$fso.DeleteFolder($dest + '\node_modules')
cd $dest

npm install

#Remove-AzureService
#Remove-AzureStorageAccount -StorageAccountName  $serviceName

Publish-AzureServiceProject –ServiceName $serviceName –Location "North Central US” -Launch

