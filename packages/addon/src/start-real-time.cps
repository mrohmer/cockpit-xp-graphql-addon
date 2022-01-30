{ Pascal Script Engine }
{ Event: StartRealTime }
{ Parameter: Keine }
var
  i: Integer;
  trackStr, tickStr, lastTickStr, positionStr, lastPositionStr, fuelStr, lastFuelStr, fuelingStr, lastFuelingStr, stopsStr, lastStopsStr: String;


{%%FUNCTION.StringReplace%%}
{%%FUNCTION.FloatToString%%}
{%%FUNCTION.FuelJson%%}
{%%FUNCTION.FuelingJson%%}
{%%FUNCTION.StopsJson%%}
{%%FUNCTION.PositionJson%%}
{%%PROCEDURE.WriteToFile%%}
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

    tickStr := '{"event": "Tick", "data": {"time": {"value": '+IntToStr(Cockpit.GesamtZeit)+', "inverted": '+IntToStr(Cockpit.RennzeitInvers)+'}}}';
    if tickStr <> lastTickStr then
    begin
      WriteToFile(tickStr);
      lastTickStr := tickStr;
    end;

    positionStr := '{"event": "PositionsChanged", "data": '+PositionJson()+'}';
    if positionStr <> lastPositionStr then
    begin
      WriteToFile(positionStr);
      lastPositionStr := positionStr;
    end;

    fuelStr := '{"event": "FuelChanged", "data": '+FuelJson()+'}';
    if fuelStr <> lastFuelStr then
    begin
      WriteToFile(fuelStr);
      lastFuelStr := fuelStr;
    end;

    fuelingStr := '{"event": "FuelingChanged", "data": '+FuelingJson()+'}';
    if fuelingStr <> lastFuelingStr then
    begin
      WriteToFile(fuelingStr);
      lastFuelingStr := fuelingStr;
    end;

    stopsStr := '{"event": "StopsChanged", "data": '+StopsJson()+'}';
    if stopsStr <> lastStopsStr then
    begin
      WriteToFile(stopsStr);
      lastStopsStr := stopsStr;
    end;

    cpSleep(500);
  end;
end.