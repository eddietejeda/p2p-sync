// create our webrtc connection
var webrtc = new SimpleWebRTC({
    // we don't do video
    localVideoEl: '',
    remoteVideosEl: '',
    // dont ask for camera access
    autoRequestMedia: false,
    // dont negotiate media
    receiveMedia: {
        mandatory: {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        }
    }
});


var ui = new UI();
var number_collection = new NumberCollection(data_collection);

ui.displayMessage('booting');

// grab the room from the URL
var room = 'sample';

// Begin session
webrtc.joinRoom(room, function (err, res) {
  ui.displayMessage('joined');
});


// called when a peer is created
webrtc.on('createdPeer', function (peer) {

    ui.setPeerCount(webrtc.getPeers().length)
    ui.setBiggestNumberFound(number_collection.getCurrentBiggestNumber());  
    ui.setProcessedByCurrentWorker(number_collection.getSearchCount());  
    ui.setInitialCollectionCount(data_collection.length);
    ui.enableUI();
  

    var remotes = document.getElementById('remotes');
    if (!remotes) return;
    var container = document.createElement('div');
    container.className = 'peerContainer';
    container.id = 'container_' + webrtc.getDomId(peer);

    // show the peer id
    var peername = document.createElement('div');
    peername.className = 'peerName';
    peername.appendChild(document.createTextNode('Peer: ' + peer.id));
    container.appendChild(peername);
  
    webrtc.sendToAll('biggest_number', {data: number_collection.getCurrentBiggestNumber()} );
    ui.displayMessage('Initial value ' + number_collection.getCurrentBiggestNumber());


    setInterval(function(){    
      var new_number = number_collection.getRandomNumber();
  
      if (new_number > number_collection.getCurrentBiggestNumber()){
    
        number_collection.setBiggestNumber(new_number);
        ui.displayMessage('Broadcasting new large number ' + new_number);
        webrtc.sendToAll('biggest_number', {data: number_collection.getCurrentBiggestNumber()} );
      }
      else{
        ui.displayMessage('Searching: ' + new_number);
      }      

      ui.setBiggestNumberFound(number_collection.getCurrentBiggestNumber());  
      ui.setProcessedByCurrentWorker(number_collection.getSearchCount());  
      ui.setPeerCount(webrtc.getPeers().length)

    }, 2000);

});



webrtc.connection.on('message', function(response){
  if(response.type === 'biggest_number'){
    console.log('current_biggest_number received' + response.payload);
    
    if( response.payload &&  response.payload.data > number_collection.getCurrentBiggestNumber() && !number_collection.hasMaxedOutSearches()   ){      
      number_collection.setBiggestNumber(response.payload.data);      
      ui.displayMessage('Broadcasting new large number: ' + number_collection.getCurrentBiggestNumber());            
    }
        
    ui.setBiggestNumberFound(number_collection.getCurrentBiggestNumber());  
    ui.setProcessedByCurrentWorker(number_collection.getSearchCount());  
  }
});


// local p2p/ice failure
webrtc.on('iceFailed', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('local fail', connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
    }
    ui.setPeerCount(webrtc.getPeers().length)

});

// remote p2p/ice failure
webrtc.on('connectivityError', function (peer) {
    var connstate = document.querySelector('#container_' + webrtc.getDomId(peer) + ' .connectionstate');
    console.log('remote fail' , connstate);
    if (connstate) {
        connstate.innerText = 'Connection failed.';
    }
    ui.setPeerCount(webrtc.getPeers().length)
});