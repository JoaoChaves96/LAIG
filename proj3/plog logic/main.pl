:- include('board.pl').
:- include('auxiliar.pl').
:- include('computer.pl').
:- include('play.pl').
:- include('cli.pl').

:- use_module(library(lists)).
:- use_module(library(random)).


%%%%%%%%%%%%%%First Call to the program%%%%%%%%%%%%%%%%%%%%%%

startGame:-
      mainMenu.
