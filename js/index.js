'use strict';

console.log('ml5 version:', ml5.version);

const imageCapture = document.querySelector('#imageCapture');
const video = document.querySelector('video');
const label = document.querySelector('#label');
const confidence = document.querySelector('#confidence');  
const captureBtn = document.querySelector('#captureBtn');
const errorElement = document.querySelector('#errorElement');

// create canvas
const canvas = document.createElement('canvas');

// = window.contraints
const contraints  = {
  Audio: false,
  video: true,
}


// video 
navigator.mediaDevices.getUserMedia(contraints)
  .then ((stream)=>{
    let videoTracks = stream.getVideoTracks();
    
    console.log('Got stream with constraints: ', contraints);
    console.log('Using video device: ' + videoTracks[0].label);
    stream.onremovetrack = () => { console.log('Stream end') } 
    

    // window.stream = stream;
    video.srcObject = stream;
    
  
  }).catch( (error)=> {
    if (error.name === 'ConstraintNotSatisfiedError') {
      errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
          constraints.video.height.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
      errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    errorMsg('getUserMedia error: ' + error.name, error);
  })

  // video error callback handler
  function errorMsg(msg, error) {
    errorElement.innerHTML += '<p>' + msg + '</p>';
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }


  // classifier
  const loop = (classifier) => {
    classifier.classify().then(results => {
      label.innerHTML = `Label: ${results[0].label}`
      confidence.innerHTML = `Confidence: ${results[0].confidence.toFixed(4)}`
      // loop(classifier); // Call again to create a loop
      setTimeout(()=> loop(classifier),500)
    });
  };

  
  // Initialize the Image Classifier method with MobileNet passing the video as the
// second argument and the getClassification function as the third
ml5.imageClassifier("MobileNet", video).then(classifier => loop(classifier));



// capture button
captureBtn.addEventListener('click',()=>{
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;
  canvas.getContext('2d').drawImage(video,0,0, canvas.width, canvas.height)
  imageCapture.src = canvas.toDataURL();
})