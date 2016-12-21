% Return element by index (Row,col)

  getelem(B,L,C,Elem):-
  nth1(L,B,MatrixRow),
  nth1(C, MatrixRow, Elem).
  %write(Elem).


% Convert letter to an index

letterToNumber(Letra,Numero):-
  (Letra == 'a' -> Numero is 1;
  Letra == 'b' -> Numero is 2;
  Letra == 'c' -> Numero is 3;
  Letra == 'd' -> Numero is 4).
%_______________________________________________________________

% Verifica se Input esta entre A-D
letra(X,_,_) :- X = 'a'; X = 'b'; X = 'c'; X = 'd'.
letra(_,_,_) :- write('Letra invalida! Try Again\n'), false.

% Verifica se Input esta entre 1-8
numero(X,_,_) :- integer(X), X >= 1,  X =< 8.
numero(_,_,_) :- write('Valor invalido! Try Again\n'), false.

%____________________________________________________________________
getNewLine :-
        get_code(T) , (T == 10 -> ! ; getNewLine).

getDigit(D) :-
        get_code(Dt) , D is Dt - 48 , (Dt == 10 -> ! ; getNewLine).

getChar(C) :-
        get_char(C) , char_code(C, Co) , (Co == 10 -> ! ; getNewLine).

%____________________________________________________________________


%
% replace a single cell in a list-of-lists
% - the source list-of-lists is L
% - The cell to be replaced is indicated with a row offset (X)
%   and a column offset within the row (Y)
% - The replacement value is Z
% - the transformed list-of-lists (result) is R
%
replace( L , X , Y , Z , R ) :-
  append(RowPfx,[Row|RowSfx],L),     % decompose the list-of-lists into a prefix, a list and a suffix
  length(RowPfx,X) ,                 % check the prefix length: do we have the desired list?
  append(ColPfx,[_|ColSfx],Row) ,    % decompose that row into a prefix, a column and a suffix
  length(ColPfx,Y) ,                 % check the prefix length: do we have the desired column?
  append(ColPfx,[Z|ColSfx],RowNew) , % if so, replace the column with its new value
  append(RowPfx,[RowNew|RowSfx],R) .  % and assemble the transformed list-of-lists
  					%


%%%%%%%%%%%%%%%Updates the score%%%%%%%%%%%%%%%
update_score(Nl, Elem2, Os1, Ns1, Os2, Ns2, J):-
  (
    Elem2 = 'p' -> P is 1;
    Elem2 = 'd' -> P is 2;
    Elem2 = 'q' -> P is 3;
    P is 0
  ),
  (is_par(J) ->
    (Nl > 4 ->
      Ns2 is Os2 + P; Ns2 is Os2
    ), Ns1 is Os1;
    (Nl < 5 ->
      Ns1 is Os1 + P; Ns1 is Os1
    ), Ns2 is Os2
  ), write('reached the end').

is_par(J):-
	X is J mod 2,
	X = 0.
