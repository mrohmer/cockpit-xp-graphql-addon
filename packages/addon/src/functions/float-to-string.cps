function FloatToString(Value: Extended):String;
begin
  Result:=StringReplace(FloatToStr(Value), ',', '.')
end;
