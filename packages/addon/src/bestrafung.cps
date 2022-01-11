{ Pascal Script Engine }
{ Event: Bestrafung }
{ Parameter: Cockpit.Slot=<SlotPlatz>,
             Cockpit.Station=<1=ausgesprochen;
                              2=disqualifiziert>,
             Cockpit.Parameter=<1=Rundenstrafe;
                                2=Zeitstrafe;
                                3=Boxengassestrafe> }
var
  Slot: Integer;
  PenaltyType, PenaltyStatus, ID: String;

{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  if Cockpit.Parameter = 1 then
  begin
    PenaltyType:='LAP_PUNISHMENT';
  end
  else if Cockpit.Parameter = 2 then
  begin
    PenaltyType:='TIME_PUNISHMENT';
  end
  else if Cockpit.Parameter = 3 then
  begin
    PenaltyType:='PIT_LANE_PUNISHMENT';
  end
  else
  begin
    PenaltyType:='';
  end;

  if Cockpit.Station = 1 then
  begin
    PenaltyStatus:='ACTIVE';
  end
  else if Cockpit.Station = 2 then
  begin
    PenaltyStatus:='DISQUALIFICATION';
  end
  else
  begin
    PenaltyStatus:='';
  end;

  ID := IntToStr(Cockpit.SlotID) + '.' + PenaltyType + '.' + IntToStr(Cockpit.GesamtZeit);

  WriteToFile('{"event": "Bestrafung", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "id": "'+ID+'", "type": "' + PenaltyType + '", "status": "' + PenaltyStatus + '"}}');

  while (cpGetStatusBestrafung(Slot)=True) do
  begin
    if (cpGetIntegerVar('Exit') = 1) then
    begin
      exit;
    end;
    cpSleep( 500 );
  end;

  PenaltyStatus:='COMPLETED';

  WriteToFile('{"event": "Bestrafung", "data": {"slot": "' + IntToStr(Cockpit.SlotID) + '", "id": "'+ID+'", "type": "' + PenaltyType + '", "status": "' + PenaltyStatus + '"}}');

end.