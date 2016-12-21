%%%%%%%%%%%%%%Some boards for testing%%%%%%%%%%%%%%%%%
board([
		[q,q,d,s],
		[q,d,p,s],
		[d,p,p,s],
		[s,s,s,s],
		[s,s,s,s],
		[s,p,p,d],
		[s,p,d,q],
		[s,d,q,q]]).

board1([
		[s,s,s,s],
		[p,s,s,s],
		[s,s,s,p],
		[s,s,d,s],
		[s,s,s,s],
		[s,s,s,s],
		[s,s,q,s],
		[s,s,s,s]]).

board2([
		[q,q,q,q],
		[q,q,q,q],
		[q,q,q,q],
		[q,q,q,q],
		[s,s,s,s],
		[s,d,s,s],
		[p,s,d,s],
		[s,s,s,s]]).

board3([
		[s,s,s,s],
		[s,s,s,s],
		[s,s,s,s],
		[s,s,s,q],
		[s,s,d,s],
		[s,s,s,s],
		[s,s,s,s],
		[s,s,s,s]]).

%%%%%%%%%%%%%Display board predicates%%%%%%%%%%%%%%%%%%%%%%%%
display_board_letter:-
	write('    a   b   c   d'),
	nl,
	write('   --------------- '),
	nl.

display_board([L1|Ls],X,Y,N):-

	display_line_number(N),
	N1 is N+1,
	write('|'),
	display_line(L1),
	nl,
	( N=4 -> write('  =================');write('   ---------------') ),
	nl,
	display_board(Ls,X,Y,N1).

display_board([],_,_,_).

display_line_number(N):-
	write(N),
	write(' ').

display_line([E|Es]):-
	translate(E,V),
	write(' '),
	write(V),
	write(' |'),
	display_line(Es).

display_line([]).


translate(s,' ').
translate(p,'*').
translate(d, 'x').
translate(q, 'X').

display_full_board(B, X, Y):-
display_board_letter,
display_board(B,X,Y, 1).


%%%%%%%%%%%%%%%%Checks for queens in the board%%%%%%%%%%%%%%%%%%%%%%%
board_has_queens(B, J):-
  (is_par(J) -> check_queens_top(B,1,1); check_queens_bot(B,5,1)).

check_queens_top(B,X,Y):-
  (X = 5 -> true;
    getelem(B, X, Y, Elem),
    (Elem = 'q' -> false;
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
    check_queens_top(B, X1, Y1))).

check_queens_bot(B,X,Y):-
  (X = 9 -> true;
    getelem(B, X, Y, Elem),
    (Elem = 'q' -> false;
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      check_queens_bot(B, X1, Y1))).

%%%%%%%%%%%%%%%%Checks for drones in the board%%%%%%%%%%%%%%%%%%%%%%%
board_has_drones(B, J):-
  (is_par(J) -> (check_drones_top(B,1,1) -> true; false); (check_drones_bot(B,5,1) -> true;write('false'),false)).

check_drones_top(B,X,Y):-
  (X = 5 -> true;
    getelem(B, X, Y, Elem),
    (Elem = 'd' -> false;
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      check_drones_top(B, X1, Y1))).

check_drones_bot(B,X,Y):-
  (X = 9 -> true;
    getelem(B, X, Y, Elem),
    (Elem = 'd' -> false;
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      check_drones_bot(B, X1, Y1))).
