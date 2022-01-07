{ Pascal Script Engine }
{ Event: Rundenrekord }
{ Parameter: Cockpit.Slot=<SlotPlatz> }

var
  Slot : Integer;

{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  WriteToFile('{"event": "Rundenrekord", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "personal": '+IntToStr(Cockpit.PersRundenrekord)+', "general": '+IntToStr(Cockpit.Rundenrekord)+'}}');

end.