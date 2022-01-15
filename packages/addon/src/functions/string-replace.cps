function StringReplace(const Input, Find, Replace : String) : String;
var
  P: Integer;
begin
  Result := Input;

  repeat
    P := Pos(Find, Result);
    if P > 0 then begin
      Delete(Result, P, Length(Find));
      Insert(Replace, Result, P);
    end;
  until P = 0;
end;