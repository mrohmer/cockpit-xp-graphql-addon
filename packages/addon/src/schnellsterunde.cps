{ Pascal Script Engine }
{ Event: SchnellsteRunde }
{ Parameter: Cockpit.Slot=<SlotPlatz> }

var
  Slot : Integer;

{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  WriteToFile('{"event": "SchnellsteRunde", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "value": '+IntToStr(Cockpit.SchnellsteRunde)+'}}');

end.