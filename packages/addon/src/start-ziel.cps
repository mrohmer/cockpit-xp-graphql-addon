{ Pascal Script Engine }
{ Event: StartZiel }
{ Parameter: Cockpit.Slot=<SlotPlatz> }

var
  Slot: Integer;
  Data, Distance, LapTime, Records: String;

{%%PROCEDURE.WriteToFile%%}

begin

  Slot := Cockpit.Slot;
  Cockpit.Slot := Slot;

  Records:='{"fastestTime"}';
  LapTime:='{"diff": '+IntToStr(Cockpit.DiffLetzteRunde)+', "last": '+IntToStr(Cockpit.Rundenzeit)+', "best": '+IntToStr(Cockpit.SchnellsteRunde)+'}';
  Distance:='{"leader": {"time": '+IntToStr(Cockpit.AbstandZeitFuehrenden)+', "lap": '+IntToStr(Cockpit.AbstandRundeFuehrenden)+'}, "next": {"time": '+IntToStr(Cockpit.AbstandZeitVordermann)+', "lap": '+IntToStr(Cockpit.AbstandRundeVordermann)+'}}';
  Data:='{"slot": "'+IntToStr(Cockpit.SlotID)+'", "distance": '+Distance+', "lapTime": '+LapTime+', "lap": '+IntToStr(Cockpit.Runde)+', "remainingLaps": '+IntToStr(Cockpit.RestRunde)+', "fuel": '+FloatToStr(Cockpit.TankStand)+'}';
  WriteToFile('{"event": "StartZiel", "data": '+Data+'}');

end.