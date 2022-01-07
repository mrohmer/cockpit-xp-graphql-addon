procedure ClearFile;
begin
  cpEnterCriticalSection;
  cpDeleteFile(cpGetPackagePath + '\events.txt');
  cpLeaveCriticalSection;
end;