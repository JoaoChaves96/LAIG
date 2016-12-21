%%%%%%%%%%%%%%%Generates a play in which the PC captures a piece and if it isn't possible, makes a random move%%%%%%%%%%%%%%%
best_play(B, Nb, J, S1, Ns1, S2, Ns2):-
  (process_pieces(B, J, Nb, S1, Ns1, S2, Ns2) -> true; rand_play(B, Nb, J, S1, Ns1, S2, Ns2)).

process_pieces(B, J, Nb, S1, Ns1, S2, Ns2):-
  (is_par(J) -> process_pieces_top(B, 1, 1, J, Nb, S1, Ns1, S2, Ns2); process_pieces_bot(B, 5, 1, J, Nb, S1, Ns1, S2, Ns2)).

process_pieces_top(B, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  (X = 5 -> false;
    getelem(B, X, Y, Elem),
    (Elem \= 's', find_next_board_bot(B, X, Y, 5, 1, J, Nb, S1, Ns1, S2, Ns2);
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      process_pieces_top(B, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).

process_pieces_bot(B, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  (X = 9 -> false;
    getelem(B, X, Y, Elem),
    (Elem \= 's', find_next_board_top(B, X, Y, 1, 1, J, Nb, S1, Ns1, S2, Ns2);
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      process_pieces_bot(B, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).

find_next_board_bot(B, L, C, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  (X = 9 -> false;
    getelem(B, X, Y, Elem),
    (Elem \= 's', move_piece(B, L, C, X, Y, Nb, J, S1, Ns1, S2, Ns2) -> true;
    (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
    find_next_board_bot(B, L, C, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).

find_next_board_top(B, L, C, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  (X = 5 -> false;
    getelem(B, X, Y, Elem),
    (Elem \= 's', move_piece(B, L, C, X, Y, Nb, J, S1, Ns1, S2, Ns2) -> true;
    (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
    find_next_board_top(B, L, C, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).


%%%%%%%%%%%%%%%Goes through the board and finds a possible play%%%%%%%%%%%%%%%
rand_play(B, Nb, J, S1, Ns1, S2, Ns2):-
  nl, write('random'), nl,
  process_pieces_rand(B, J, Nb, S1, Ns1, S2, Ns2).

process_pieces_rand(B, J, Nb, S1, Ns1, S2, Ns2):-
  (is_par(J) -> process_pieces_top_rand(B, 1, 1, J, Nb, S1, Ns1, S2, Ns2); process_pieces_bot_rand(B, 5, 1, J, Nb, S1, Ns1, S2, Ns2)).

process_pieces_top_rand(B, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  write('entrou no rand'),
  (X = 5 -> false;
    getelem(B, X, Y, Elem),
    (Elem \= 's', find_next_board(B, X, Y, 1, 1, J, Nb, S1, Ns1, S2, Ns2) -> true;
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      process_pieces_top_rand(B, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).

process_pieces_bot_rand(B, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  (X = 9 -> false;
    getelem(B, X, Y, Elem),
    (Elem \= 's', find_next_board(B, X, Y, 1, 1, J, Nb, S1, Ns1, S2, Ns2) -> true;
      (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
      process_pieces_bot_rand(B, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).

find_next_board(B, L, C, X, Y, J, Nb, S1, Ns1, S2, Ns2):-
  (X = 9 -> false;
    (move_piece(B, L, C, X, Y, Nb, J, S1, Ns1, S2, Ns2) -> true;
    (Y = 4 -> Y1 is 1, X1 is X + 1; Y1 is Y + 1, X1 is X),
    find_next_board(B, L, C, X1, Y1, J, Nb, S1, Ns1, S2, Ns2))).
