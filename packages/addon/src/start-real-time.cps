{ Pascal Script Engine }
{ Event: StartRealTime }
{ Parameter: Keine }
var
  i: Integer;
  trackStr: String;


{%%FUNCTION.StringReplace%%}
{%%FUNCTION.FloatToString%%}
{%%FUNCTION.FuelJson%%}
{%%FUNCTION.FuelingJson%%}
{%%FUNCTION.StopsJson%%}
{%%FUNCTION.PositionJson%%}
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

    WriteEventToFileWhenChanged('Tick', '{"time": {"value": '+IntToStr(Cockpit.GesamtZeit)+', "inverted": '+IntToStr(Cockpit.RennzeitInvers)+'}}');
    WriteEventToFileWhenChanged('PositionsChanged', PositionJson());
    WriteEventToFileWhenChanged('FuelChanged', FuelJson());
    WriteEventToFileWhenChanged('FuelingChanged', FuelingJson());
    WriteEventToFileWhenChanged('StopsChanged', StopsJson());

    cpSleep(500);
  end;
end.