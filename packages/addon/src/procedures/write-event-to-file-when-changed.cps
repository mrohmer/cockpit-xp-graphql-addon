procedure WriteEventToFileWhenChanged(key: string; eventName: string; value: string);
var
  lastValue: String;
begin
  lastValue := cpGetStringVar('event.' + key);
  if value <> lastValue then
  begin
    cpSetStringVar('event.' + key, value);
    WriteToFile('{"event": "' + eventName + '", "data": ' + value + '}');
  end;
end;