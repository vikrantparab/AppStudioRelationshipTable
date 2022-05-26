ng build
$original="D:\Workspace\Local\AppStudioRelationshipTable\dist\AngMatTablePOC\*"
$dest = "D:\Workspace\Local\TargetDist"
Copy-Item -Path $original -Destination $dest -Recurse -force
