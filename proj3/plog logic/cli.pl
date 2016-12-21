%%%%%%%%%%%ClearScreen%%%%%%%%%%%%%%%%%%
clearScreen :-
		printBlank(65).

printBlank(A) :-
			A > 0,
			nl,
			A1 is A - 1,
			printBlank(A1).

printBlank(_).


%%%%%%%%%%%%%%%Asks for the player name%%%%%%%%%%%%%%%
read_player(X):-
	write('player name: '),
	read(X),
	nl.


%%%%%%%%%%%%%%%Main Menu%%%%%%%%%%%%%%%
mainMenu :-
		clearScreen,
		printMainMenu,
		get_char(In),
		(
			In = '1' -> write('Chose to play\n'), playMenu;
			In = '2' -> write('Chose Instructions\n'), instructionsMenu;
			In = '3' -> write('Chose Exit\n');
			mainMenu
		).

printMainMenu :-

			write('##############################\n'),  %30 spaces
			write('#                            #\n'),
			write('#        Martian Chess       #\n'),
			write('#                            #\n'),
			write('##############################\n'),
			write('##############################\n'),
			write('#                            #\n'),
			write('#    1 - Play                #\n'),
			write('#    2 - Instructions        #\n'),
			write('#    3 - Exit                #\n'),
			write('#                            #\n'),
			write('##############################\n'),
			printBlank(20).


%%%%%%%%%%%%%%%Play Menu%%%%%%%%%%%%%%%
playMenu :-
		clearScreen,
		printPlayMenu,
		get_char(In),
		(
			In = '1' -> pvpMenu;
			In = '2' -> pvPCMenu;
			In = '3' -> playPC_vs_PC(_, _, _);
			playMenu
		),
		mainMenu.

printPlayMenu:-
	write('##############################\n'),
	write('#                            #\n'),
	write('# Chose a mode:              #\n'),
	write('#                            #\n'),
	write('#  1 - Player vs Player      #\n'),
	write('#  2 - Player vs Computer    #\n'),
	write('#  3 - Computer vs Computer  #\n'),
	write('#                            #\n'),
	write('##############################\n'),
	printBlank(20).


%%%%%%%%%%%%%%%Player vs Player initiation menu%%%%%%%%%%%%%%%
pvpMenu:-
		clearScreen,
		read_player(X),
		clearScreen,
		read_player(Y),
		clearScreen,
		color1Menu(C1),
		clearScreen,
		color2Menu(C2),
		clearScreen,
		(
			C1 > C2 -> play(B, X, Y, 1);
								 play(B, X, Y, 0)
		),
		mainMenu.


color1Menu(C1):-
		printPlayer1Turn,
		nl,
		write('From 0 to 10, how red is your hair? :)'),
		nl,
		get_char(_),
		get_code(C11),
		C1 is C11 - 48,
		(
			(C1 < 0;C1 > 10) -> clearScreen, color1Menu(_); true
		).

color2Menu(C2):-
		printPlayer2Turn,
		nl,
		write('From 0 to 10, how red is your hair? :)'),
		nl,
		get_char(_),
		get_code(C21),
		C2 is C21 - 48,
		(
			(C2 < 0;C2 > 10) -> clearScreen, color2Menu(_); true
		).



%%%%%%%%%%%%%%%Player vs PC Menu%%%%%%%%%%%%%%%
pvPCMenu:-
	clearScreen,
	printPlayMode,
	getChar(In),
	(
		In = '1' -> play_vs_PC_easy(B, X, Y, 1);
		In = '2' -> play_vs_PC_hard(B, X, Y, 0);
		pvPCMenu
	),
	mainMenu.


printPlayMode:-
	write('##############################\n'),
	write('#                            #\n'),
	write('# Chose a dificculty         #\n'),
	write('#                            #\n'),
	write('#  1 - Easy                  #\n'),
	write('#  2 - Hard                  #\n'),
	write('#                            #\n'),
	write('##############################\n'),
	printBlank(20).


%%%%%%%%%%%%%%%Instructions Menu%%%%%%%%%%%%%%%
instructionsMenu :-
			clearScreen,
			printInstructionsMenu,
			get_char(_),
			get_char(_),
			mainMenu.

printInstructionsMenu :-
			write('######################################################\n'),
			write('#                                                    #\n'),
			write('#                                                    #\n'),
			write('#            Martian Chess - Instructions            #\n'),
			write('#                                                    #\n'),
			write('#                                                    #\n'),
			write('######################################################\n'),
			write('#                                                    #\n'),
			write('#                                                    #\n'),
			write('#    Martian Chess is a chess-like strategy gme in   #\n'),
			write('#   which location determines which pieces you can   #\n'),
			write('#   can move. Like Chess, each typee of piece has    #\n'),
			write('#   its own way of moving, and you can capture by    #\n'),
			write('#   moving onto an opponent`s square; but, unlike    #\n'),
			write('#   Chess, you can only move pieces placed in your   #\n'),
			write('#   own quadrant, and only attack those in other     #\n'),
			write('#   quadrants which may include your own former      #\n'),
			write('#   pieces. The game ends when someone runs out of   #\n'),
			write('#   pieces, and the winner is the player who has     #\n'),
			write('#   captured the most points.                        #\n'),
			write('#                                                    #\n'),
			write('#                                                    #\n'),
			write('######################################################\n'),
			printBlank(10).


%%%%%%%%%%%%%%%Turns and, game over and win prints%%%%%%%%%%%%%%%
printPlayer1Turn:-
	write('########################################\n'),
	write('#            Player 1 Turn             #\n'),
	write('########################################\n').

printPlayer2Turn:-
	write('########################################\n'),
	write('#            Player 2 Turn             #\n'),
	write('########################################\n').

printGameOver:-
	write('########################################\n'),
	write('#                                      #\n'),
	write('#              Game Over!              #\n'),
	write('#                                      #\n'),
	write('########################################\n').

printPlayer1Win:-
	write('########################################\n'),
	write('#                                      #\n'),
	write('#           Player 1 Wins!!            #\n'),
	write('#                                      #\n'),
	write('########################################\n').

printPlayer2Win:-
	write('########################################\n'),
	write('#                                      #\n'),
	write('#           Player 2 Wins!!            #\n'),
	write('#                                      #\n'),
	write('########################################\n').

printComputerWin:-
	write('########################################\n'),
	write('#                                      #\n'),
	write('#           Computer Wins!!            #\n'),
	write('#                                      #\n'),
	write('########################################\n').

printPlayerTurn(J):-
	(is_par(J) -> printPlayer2Turn; printPlayer1Turn).


%%%%%%%%%%%%%%%Asks the player for a new play%%%%%%%%%%%%%%%
ask_play(B, Nb, J, S1, Ns1, S2, Ns2) :-
	write('Digite a linha (numero) da peca a mover'), nl,
	getDigit(LinhaToMove),
	numero(LinhaToMove, X, L1),
	write('Digite a coluna (letra) da peca a mover'), nl,
	getChar(ColunaToMove),
	letra(ColunaToMove, X, L1),
	letterToNumber(ColunaToMove,Yi),
 	write('Digite a linha (numero) do destino'), nl,
	getDigit(LinhaDestino),
	numero(LinhaDestino, X, L1),
	write('Digite a coluna (letra) do destino'), nl,
	getChar(ColunaDestino),
	letra(ColunaDestino, X, L1),
	letterToNumber(ColunaDestino,Yf),
	(move(LinhaToMove, J, S1, Ns1, S2, Ns2), move_piece(B, LinhaToMove, Yi, LinhaDestino, Yf, Nb, J, S1, Ns1, S2, Ns2) -> true;
		nl,
		write('Jogada invalida! Try again...\n'),
		nl,
		ask_play(B, Nb, J, S1, Ns1, S2, Ns2)).


%%%%%%%%%%%%%%%Compares the scores to chose the winner%%%%%%%%%%%%%%%
compare_scores(Fs1, Fs2, F):-
	(Fs1 > Fs2 -> printPlayer1Win; (F = 1 -> printComputerWin;printPlayer2Win)),
	printBlank(15),
	getChar(_).
