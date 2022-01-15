function FlaotToString(Value: Boolean):String;
begin
  Result:=StringReplace(FloatToStr(Value), ',', '.')
end;
