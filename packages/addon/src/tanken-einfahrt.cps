{ Pascal Script Engine }
{ Event: TankenEinfahrt }
{ Parameter: Cockpit.Slot=<SlotPlatz> }

var
  Slot : Integer;

{%%FUNCTION.BoolToStr%%}
{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  WriteToFile('{"event": "TankenEinfahrt", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "active": '+BoolToStr(Cockpit.TankenAktiviert)+', "stops": '+IntToStr(Cockpit.Tankstopps)+'}}');

end.