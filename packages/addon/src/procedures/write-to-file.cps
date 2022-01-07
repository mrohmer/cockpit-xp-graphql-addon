procedure WriteToFile(s: string);
var
  fs: TFileStream;
  FileFullPath: String;
begin
  FileFullPath := cpGetPackagePath + '\events.txt';
  cpEnterCriticalSection;
  try
    fs := TFileStream.Create(FileFullPath, fmOpenWrite or fmShareDenyNone);
  except
    try
      fs := TFileStream.Create(FileFullPath, fmCreate or fmShareDenyNone );
    except
        // geht nichts
      exit;
    end;
  end;

  try
      // an das Ende der Datei gehen (Append Modus)
    fs.Seek(0, soFromEnd);
      // String aufbauen
    fs.Write(s, Length(s));
    fs.Write(#13#10, 2);
    fs.free;
  finally
    cpLeaveCriticalSection;
  end;
end;