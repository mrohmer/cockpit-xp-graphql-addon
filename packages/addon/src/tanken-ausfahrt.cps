{ Pascal Script Engine }
{ Event: TankenAusfahrt }
{ Parameter: Cockpit.Slot=<SlotPlatz> }

var
  Slot : Integer;

{%%FUNCTION.BoolToStr%%}
{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  WriteToFile('{"event": "TankenAusfahrt", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "active": '+BoolToStr(Cockpit.TankenAktiviert)+', "stops": '+IntToStr(Cockpit.Tankstopps)+'}}');

end.