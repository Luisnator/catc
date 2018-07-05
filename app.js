let socket = io('http://ec2-54-93-171-91.eu-central-1.compute.amazonaws.com:8008');
//let socket = io('http://localhost:8008');

let chess = new Chess();

let onDrop = function(source, target, piece, newPos, oldPos, orientation) {
//console.log(chess.fen());
//console.log(chess.moves({sloppy: true}));
    if(source !== target) {

        if(chess.move(source + target, {sloppy: true}) == null) return 'snapback';

        socket.emit('receive', {
            FEN: chess.fen(),
            ID_game: 0,
            turns: getallMoves()
        })
    }
};

let cfg = {
    draggable: true,
    position: 'start',
    onDrop: onDrop
};

let board = ChessBoard('board', cfg);

socket.on('makeMove', data => {
    console.log(typeof (data));
    console.log(data);
    chess.move(data.Move, {sloppy: true});
    board.move(data.Move.substr(0,2) + '-' + data.Move.substr(2,4));
});

function getallMoves()
{
    let chesspos = ['a1','a2','a3','a4','a5','a6','a7','a8','b1','b2','b3','b4','b5','b6','b7','b8','c1','c2','c3','c4','c5','c6','c7','c8','d1','d2','d3','d4','d5','d6','d7','d8','e1','e2','e3','e4','e5','e6','e7','e8','f1','f2','f3','f4','f5','f6','f7','f8','g1','g2','g3','g4','g5','g6','g7','g8','h1','h2','h3','h4','h5','h6','h7','h8'];
    let chessmoves = [];
    console.log(chesspos);
    for(var i of chesspos)
    {
       // console.log(i);
        //console.log(chess.moves({square : i}));
        let mvs = chess.moves({square: i});
		//console.log(mvs);
        if(mvs.length != 0)
        {
            for(var o of mvs)
            {
                let move;
                if(o.length >= 3)
                {
                    move = i + o.substr(-2);
					console.log(move);
                }
                else
                {
                    move = i + o;
                }
                chessmoves.push(move);
            }
        }
    }
    return chessmoves;
    console.log(chessmoves);


}
