function SectorJson(const SlotId, StationId: Integer):String;
var
  TimeRekord: Integer;
  SpeedRekord: Extended;
  SpeedStr, TimeStr: String;
begin
  Cockpit.Slot := SlotId;
  Cockpit.Station := StationId;
  if Cockpit.FahrerName <> '' then
  begin
    Result:='';
  end
  else if Cockpit.Station <> StationId then
  begin
    Result:='';
  end
  else
    // todo: check for station existance

    SpeedRekord := cpGetFloatVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Cockpit.Station) + '.sektorSpeedRekord');
    TimeRekord := cpGetIntegerVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Cockpit.Station) + '.sektorTimeRekord');

    if SpeedRekord < Cockpit.TopSpeed then
    begin
      cpSetFloatVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Cockpit.Station) + '.sektorSpeedRekord', Cockpit.TopSpeed);
      SpeedRekord := Cockpit.TopSpeed;
    end;
    if TimeRekord < Cockpit.Sektorzeit then
    begin
      cpSetIntegerVar(IntToStr(Cockpit.SlotID) + '.' + IntToStr(Cockpit.Station) + '.sektorTimeRekord', Cockpit.Sektorzeit);
      TimeRekord := Cockpit.Sektorzeit;
    end;

    SpeedStr := '{"current": '+FloatToString(Cockpit.TopSpeed)+', "rekord": ' + FloatToStr(SpeedRekord) + '}';
    TimeStr := '{"current": '+IntToStr(Cockpit.Sektorzeit)+', "rekord": ' + IntToStr(TimeRekord) + '}';

    Result:='{"slot": "' + IntToStr(Cockpit.SlotID) + '", "station": '+IntToStr(Cockpit.Station)+', "speed": '+SpeedStr+', "time": '+TimeStr+'}';
  end;
end;
