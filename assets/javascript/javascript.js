  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBSuhcGug9NvoxS3iig7LXY2lWyTFdh03w",
    authDomain: "train-schedule-hw-efc2c.firebaseapp.com",
    databaseURL: "https://train-schedule-hw-efc2c.firebaseio.com",
    projectId: "train-schedule-hw-efc2c",
    storageBucket: "train-schedule-hw-efc2c.appspot.com",
    messagingSenderId: "673613486611"
  };
  firebase.initializeApp(config);

  var database = firebase.database();




  // Capture Button Click
  $("#add-train").on("click", function(event) {
    // prevent form from trying to submit/refresh the page
    event.preventDefault();

    // Capture User Inputs and store them into variables
    var trainName = $("#name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#firstTrain-input").val().trim(), "HH:mm").format("HH:mm");
    var frequency = $("#frequency-input").val().trim();

    var newTrain = {
        name: trainName,
        place: destination,
        fTrain: firstTrain,
        frq: frequency,
    }

    // upload train data to firebase and console log
    database.ref().push(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.place);
    console.log(newTrain.fTrain);
    console.log(newTrain.frq);

    // resets input boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-input").val("");
    $("#frequency-input").val("");
    
    //might need return false if preventdefault doesnt work
    //return false;
  });
    database.ref().on("child_added", function(childSnapshot){
        console.log(childSnapshot.val());

        var childTrainName = childSnapshot.val().name;
        var childDestination = childSnapshot.val().place;
        var childFirstTrain = childSnapshot.val().fTrain;
        var childFrequency = childSnapshot.val().frq;


        var firstTrainPushBack = moment(childFirstTrain, "HH:mm");
        console.log(firstTrainPushBack);
        
        var currentTime = moment().format("HH:mm");
        console.log("Time now" + currentTime);

        var timeDifference = moment().diff(moment(firstTrainPushBack), "minutes");
        console.log(childFirstTrain);
        console.log("Time difference: " + timeDifference);

        //divide the rest of time remaining with frequency
        var timeRemain = timeDifference % childFrequency;
        console.log ("time remain: " + timeRemain);

        // Need to calculate the minutes until our next train
        var trainComingIn = childFrequency - timeRemain;
        console.log("train coming in:" + trainComingIn + "minutes");

        //next train
        var nextTrain = moment().add(trainComingIn, "minutes").format("HH:mm");
        $("#trainTable>tbody").append("<tr><td>" + childTrainName + "</td><td>" + childDestination + "</td><td>" + childFrequency + "</td><td>" + nextTrain + "</td><td>" + trainComingIn + "</td></tr>");
    });


