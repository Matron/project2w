//adjacency list
var INVALID_NODE = -1;
//base
GraphNode = {
    index: INVALID_NODE
};

NavGraphNode = {
    //index from base
    position: new Position()
};

GraphEdge = {
    indexFrom: INVALID_NODE,
    indexTo: INVALID_NODE,
    cost: 1
};

SparseGraph = {
    //nodes that comprise this graph
    nodeVector: new Array(),

    //vector of adjacency edge lists
    edgeListVector: new Array(),

    //is this a directed graph?
    isDigraph: false,

    //index of next node to be added
    nextNodeIndex: 0,

    getNode: function( _index ) {

    },

    addNode: function( _node ) {

    },

    removeNode: function( _index ) {

    },

    getEdge: function( _from, _to ) {

    },

    addEdge: function( _edge ) {

    },

    removeEdge: function( _from, _to ) {

    },

    //methids fro loading and saving graphs from stream or file.
}




 