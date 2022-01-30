{ Pascal Script Engine }
{ Event: TopSpeed-Stopp }
{ Parameter: Cockpit.Slot=<SlotPlatz>,
             Cockpit.Station=<TopSpeed-Station> }

var
  Slot, Station, TimeRekord: Integer;
  SpeedRekord: Extended;
  SpeedStr, TimeStr: String;

{%%FUNCTION.StringReplace%%}
{%%FUNCTION.FloatToString%%}
{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  Station := Cockpit.Station;
  Cockpit.Station := Station;

  SpeedRekord := cpGetFloatVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Station) + '.sektorSpeedRekord');
  TimeRekord := cpGetIntegerVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Station) + '.sektorTimeRekord');

  if SpeedRekord < Cockpit.TopSpeed then
  begin
    cpSetFloatVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Station) + '.sektorSpeedRekord', Cockpit.TopSpeed);
    SpeedRekord := Cockpit.TopSpeed;
  end;
  if TimeRekord < Cockpit.Sektorzeit then
  begin
    cpSetIntegerVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Station) + '.sektorTimeRekord', Cockpit.Sektorzeit);
    TimeRekord := Cockpit.Sektorzeit;
  end;

  SpeedStr := '{"current": '+FloatToString(Cockpit.TopSpeed)+', "rekord": ' + FloatToStr(SpeedRekord) + '}';
  TimeStr := '{"current": '+IntToStr(Cockpit.Sektorzeit)+', "rekord": ' + IntToStr(TimeRekord) + '}';
  WriteToFile('{"event": "Topspeed-Stopp", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "station": '+IntToStr(Cockpit.Station)+', "speed": '+SpeedStr+', "time": '+TimeStr+'}}');

end.