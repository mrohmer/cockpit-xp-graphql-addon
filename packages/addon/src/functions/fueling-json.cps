function FuelingJson():String;
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
      if Cockpit.TankenAktiviert then
      begin
        if Length(str) > 0 then
        begin
          str:=str+', ';
        end;
        str:=str+IntToStr(Cockpit.SlotID);
      end;
    end;
  end;

  Result:='['+str+']';
end;
