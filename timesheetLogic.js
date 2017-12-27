
var config = {
    apiKey: "AIzaSyB_N-ia-ABwbGeq3MEYCsubyXkEqRJAlqE",
    authDomain: "traintime-ee9d2.firebaseapp.com",
    databaseURL: "https://traintime-ee9d2.firebaseio.com",
    projectId: "traintime-ee9d2",
    storageBucket: "traintime-ee9d2.appspot.com",
    messagingSenderId: "559977804016"
};
firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
  var dest = "";
  var firstTrain = 0; 
  var freq = 0;
// 2. Button for adding Train
$("#addTrain").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
   trainName = $("#train-name-input").val().trim();
   dest = $("#dest-input").val().trim();
   firstTrain = moment($("#firstTrain-input").val().trim(), "HH:mm").format("X");
   freq = $("#freq-input").val().trim();

  
  var newTrain = {
    trainName: trainName,
    destination: dest,
    firstTrain: firstTrain,
    frequency: freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  console.log("Train added!");
});
  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#firstTrain-input").val("");
  $("#freq-input").val("");


// 3. Create Firebase event for adding train schedule to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().trainName;
  var dest = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var freq = childSnapshot.val().frequency;

  // Info
  console.log(trainName);
  console.log(dest);
  console.log(firstTrain);
  console.log(freq);

   

   
   

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTrainConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    nextTrain = moment(nextTrain).format("hh:mm");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" +
  freq + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {

      // Change the HTML to reflect
      $("#train-name-input").text(snapshot.val().trainName);
      $("#dest-input").text(snapshot.val().dest);
      $("#firstTrain-input").text(snapshot.val().firstTrain);
      $("#freq-input").text(snapshot.val().freq);
    });


