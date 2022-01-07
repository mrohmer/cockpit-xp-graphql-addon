function BoolToStr(Value: Boolean):String;
begin
  if Value then
  begin
    Result:='true';
  end
  else
  begin
    Result:='false';
  end;
end;
