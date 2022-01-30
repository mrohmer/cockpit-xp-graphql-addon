function FuelJson():String;
var
  str: String;
  i: Integer;
begin
  str:='';
  for i := 1 to cpCountOfSlots() do
  begin
    Cockpit.Slot := i;
    if Cockpit.FahrerName <> '' then
    begin
      if Length(str) > 0 then
      begin
        str:=str+', ';
      end;
      str:=str+'"'+IntToStr(Cockpit.SlotID)+'": '+FloatToString(Cockpit.TankStand);
    end;
  end;

  Result:='{'+str+'}';
end;
