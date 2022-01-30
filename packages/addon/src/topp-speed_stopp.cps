{ Pascal Script Engine }
{ Event: TopSpeed-Stopp }
{ Parameter: Cockpit.Slot=<SlotPlatz>,
             Cockpit.Station=<TopSpeed-Station> }

var
  Slot, Station, SpeedRekord, TimeRekord: Integer;
  SpeedStr, TimeStr: String;

{%%FUNCTION.StringReplace%%}
{%%FUNCTION.FloatToString%%}
{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  Station := Cockpit.Station;
  Cockpit.Station := Station;

  if cpGetFloatVar(IntToStr(Cockpit.SlotID) + '.sektorSpeedRekord') < Cockpit.TopSpeed then
  begin
    cpSetFloatVar(IntToStr(Cockpit.SlotID) + '.sektorSpeedRekord', Cockpit.TopSpeed);
  end;
  if cpGetIntegerVar(IntToStr(Cockpit.SlotID) + '.sektorTimeRekord') < Cockpit.Sektorzeit then
  begin
    cpSetIntegerVar(IntToStr(Cockpit.SlotID) + '.sektorTimeRekord', Cockpit.Sektorzeit);
  end;

  SpeedStr := '{"current": '+FloatToString(Cockpit.TopSpeed)+', "rekord": ' + FloatToStr(cpGetFloatVar(IntToStr(Cockpit.SlotID) + '.sektorSpeedRekord')) + '}';
  TimeStr := '{"current": '+IntToStr(Cockpit.Sektorzeit)+', "rekord": ' + IntToStr(cpGetIntegerVar(IntToStr(Cockpit.SlotID) + '.sektorTimeRekord')) + '}';
  WriteToFile('{"event": "Topspeed-Stopp", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "station": '+IntToStr(Cockpit.Station)+', "speed": '+SpeedStr+', "time": '+TimeStr+'}}');

end.