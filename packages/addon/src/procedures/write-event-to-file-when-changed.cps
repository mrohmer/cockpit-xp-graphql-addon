procedure WriteEventToFileWhenChanged(key: string; value: string);
var
  lastValue: String;
begin
  lastValue := cpGetStringVar('event.' + key);
  if value <> lastValue then
  begin
    cpSetStringVar('event.' + key, value);
    WriteToFile('{"event": "' + key + '", "data": ' + value + '}');
  end;
end;