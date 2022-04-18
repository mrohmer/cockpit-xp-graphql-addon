{ Pascal Script Engine }
{ Event: StartRealTime }
{ Parameter: Keine }
var
  i, slotId, stationId: Integer;
  trackStr, sectorEventStr: String;


{%%FUNCTION.StringReplace%%}
{%%FUNCTION.FloatToString%%}
{%%FUNCTION.FuelJson%%}
{%%FUNCTION.FuelingJson%%}
{%%FUNCTION.StopsJson%%}
{%%FUNCTION.PositionJson%%}
{%%FUNCTION.SpeedValueJson%%}
{%%FUNCTION.SectorJson%%}
{%%PROCEDURE.WriteToFile%%}
{%%PROCEDURE.WriteEventToFileWhenChanged%%}
{%%PROCEDURE.ClearFile%%}

begin
  cpSetIntegerVar('Exit', 0);
  ClearFile();

  trackStr:='{"name": "'+Cockpit.RennbahnName+'", "record": '+IntToStr(Cockpit.Bahnrekord)+'}';

  WriteToFile('{"event": "StartRealTime", "data": {"track": '+trackStr+', "targetLap": '+IntToStr(cpGetTargetLap())+', "targetTime": '+intToStr(cpGetTargetTime())+'}}');

  for i := 1 to 8 do
  begin
    Cockpit.Slot := i;
    if Cockpit.FahrerName <> '' then
    begin
      WriteToFile('{"event": "RegisterDriver", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "name": "'+Cockpit.FahrerName+'", "car": "'+Cockpit.FahrzeugName+'", "position": '+IntToStr(Cockpit.Position)+', "fuel": '+FloatToString(Cockpit.TankStand)+', "races": {"completed": '+IntToStr(Cockpit.AnzahlRennen)+', "won": '+IntToStr(Cockpit.AnzahlSiege)+'}}}');
    end;
  end;

  while (True) do
  begin
    if (cpGetIntegerVar('Exit') = 1) then
    begin
      exit;
    end;

    WriteEventToFileWhenChanged('Tick', 'Tick', '{"time": {"value": '+IntToStr(Cockpit.GesamtZeit)+', "inverted": '+IntToStr(Cockpit.RennzeitInvers)+'}}');
    WriteEventToFileWhenChanged('PositionsChanged', 'PositionsChanged', PositionJson());
    WriteEventToFileWhenChanged('FuelChanged', 'FuelChanged', FuelJson());
    WriteEventToFileWhenChanged('FuelingChanged', 'FuelingChanged', FuelingJson());
    WriteEventToFileWhenChanged('StopsChanged', 'StopsChanged', StopsJson());
    WriteEventToFileWhenChanged('SpeedValueChanged', 'SpeedValueChanged', SpeedValueJson());

    for slotId := 1 to cpCountOfSlots() do
    begin
      for stationId := 1 to 10 do
      begin
        sectorEventStr := SectorJson(slotId, stationId)
        if sectorEventStr <> '' then
        begin
          WriteEventToFileWhenChanged('SectorTime.'+IntToStr(slotId)+'.'+IntToStr(stationId), 'SectorTime', sectorEventStr);
        end;
      end;
    end;

    cpSleep(500);
  end;
end.