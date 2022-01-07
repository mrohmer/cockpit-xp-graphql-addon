{ Pascal Script Engine }
{ Event: Bahnrekord }
{ Parameter: Cockpit.Slot=<SlotPlatz> }

var
  Slot : Integer;

{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  WriteToFile('{"event": "Bahnrekord", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "value": '+IntToStr(Cockpit.Bahnrekord)+'}}');

end.