{ Pascal Script Engine }
{ Event: ChangeRealTimeStatus }
{ Parameter: Cockpit.Parameter = <RennStatus> }

var
  EventType, RaceMode, RaceStatus: String;

{%%PROCEDURE.WriteToFile%%}

begin
  if Cockpit.Parameter = 0 then
  begin
    EventType:='SESSION_IS_STARTING';
  end
  else if Cockpit.Parameter = 1 then
  begin
    EventType:='SESSION_STARTED';
  end
  else if Cockpit.Parameter = 2 then
  begin
    EventType:='RACE_STARTING';
  end
  else if Cockpit.Parameter = 3 then
  begin
    EventType:='RACE_ENDED_BY_FIRST';
  end
  else if Cockpit.Parameter = 4 then
  begin
    EventType:='RACE_ENDED_BY_LAST';
  end
  else if Cockpit.Parameter = 6 then
  begin
    EventType:='CHAOS';
  end
  else if Cockpit.Parameter = 7 then
  begin
    EventType:='CHAOS_WITH_FOLLOW_UP_TIME';
  end
  else if Cockpit.Parameter = 9 then
  begin
    EventType:='SESSION_CANCELED';
  end
  else
  begin
    EventType:='';
  end;

  if cpGetRacingMode() = 'R' then
  begin
    RaceMode:='RACE';
  end
  else if cpGetRacingMode() = 'T' then
  begin
    RaceMode:='TRAINING';
  end
  else if cpGetRacingMode() = 'Q' then
  begin
    RaceMode:='QUALIFYING';
  end
  else
  begin
    RaceMode:=cpGetRacingMode();
  end;

  if cpGetRacingStatus() = 'R' then
  begin
    RaceStatus:='RUNNING';
  end
  else if cpGetRacingStatus() = 'S' then
  begin
    RaceStatus:='STOPPED';
  end
  else if cpGetRacingStatus() = 'P' then
  begin
    RaceStatus:='PAUSED';
  end
  else
  begin
    RaceStatus:=cpGetRacingStatus();
  end;

  WriteToFile('{"event": "ChangeRealTimeStatus", "data": {"type": "' + EventType + '", "mode": "' + RaceMode + '", "status": "' + RaceStatus + '", "targetLap": '+IntToStr(cpGetTargetLap())+', "targetTime": '+intToStr(cpGetTargetTime())+'}}');
end.
