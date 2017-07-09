/*global angular:true */
/*global console:true */


angular.module("clockApp", [])

.controller("clockCtrl", function($scope) {
  var day_duration = 60 * 60 * 24;
  var beat_duration = day_duration / 1000;
  $scope.Math = Math;

  $scope.clock = {
    hands: {
      beat: {
        abb: "bt",
        name: "beat",
        rotate: false,
        orientation: function() {
          return (Math.floor($scope.beat.pulse / 20) * 2) * 3.6 + 180;
        },
      },
      twenny: { // Twenty Beats / 1/50th of a day / about 30 minutes
        abb: "tw",
        name: "twenny",
        rotate: false,
        orientation: function() {
          return (($scope.beat.pulse % 20) * 5) * 3.6 + 180;
        },
      }
    }
  };


  $scope.beat = {
    second_to_beat: function(s) {
      return s / 86.4;
    },
    beat_to_second: function(b) {
      return b * 86.4;
    },
    elapsed_seconds: function() {
      var date = new Date();
      return date.getSeconds() + (date.getMinutes() * 60) + (date.getHours() * 3600);
    },
    raw_value: function() {
      return $scope.beat.second_to_beat($scope.beat.elapsed_seconds()).toFixed(2);
    },
    value: function() {
      return Math.floor($scope.beat.raw_value());
    },
    next_whole_beat: function() {
      return Math.ceil($scope.beat.raw_value());
    },
    set_beat: function(beat) {
      $scope.beat.pulse = beat;
      $scope.$broadcast('beat', beat);
    },
    advance_beat: function() {
      // console.log('advance_beat');
      $scope.beat.set_beat($scope.beat.pulse + 1);
    },
    init: function() {
      // set initial beat
      // console.log("attention");
      $scope.beat.set_beat($scope.beat.value());
      // calculate when next beat will be
      var time_now_in_seconds  = $scope.beat.elapsed_seconds();
      var next_beat_in_seconds = $scope.beat.beat_to_second($scope.beat.next_whole_beat());
      var seconds_until_next_beat = next_beat_in_seconds - time_now_in_seconds;
      // set the next beat at the correct time, then schedule the updapte
      // console.log("march in " + Math.floor(seconds_until_next_beat) );
      setTimeout(function() {
        // console.log("march");
        $scope.beat.advance_beat();
        setInterval(function() {
          // var direction = $scope.beat.pulse % 2 == 0 ? "left" : "right"
          // console.log(direction);
          $scope.beat.advance_beat();
        }, beat_duration * 1000);
      }, seconds_until_next_beat * 1000 );
    }
  };



  $scope.labels = [
    { beat: 1000 / 24 * 7, text: "SEVEN", size: 20, radius: 70 },
    { beat: 1000 / 24 * 8, text: "08", size: 20, radius: 70 },
    { beat: 1000 / 24 * 9, text: "09", size: 20, radius: 70 },
    { beat: 1000 / 24 * 10, text: "10", size: 20, radius: 70 },
    { beat: 1000 / 24 * 11, text: "11", size: 20, radius: 70 },
    { beat: 1000 / 24 * 12, text: "12", size: 20, radius: 70 },
    { beat: 1000 / 24 * 13, text: "13", size: 20, radius: 70 },
    { beat: 1000 / 24 * 14, text: "TWO", size: 20, radius: 70 },
  ];

  $scope.pies = [
    { start: 300, end: 600, radius: 60, color:"#fad541"},
    { start: 800, end: 900, radius: 60, color:"#AEB6BF"},
    { start: 900, end: 200, radius: 60, color:"#5D6D7E"}
  ];

  $scope.items = [
    { beat:   0, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 100, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 200, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 300, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 400, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 500, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 600, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 700, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 800, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 900, name: "images/spritemap.svg#dash", size: "5", radius: 50 },
    { beat: 20, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 40, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 60, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 80, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 100, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 120, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 140, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 180, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 },
    { beat: 160, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 }
  ];



  function orient_hand(hand) {
    var hand_element = document.querySelectorAll('.' + hand.name + '-container');
    hand_element[0].style.webkitTransform = 'rotateZ('+ hand.orientation() +'deg)';
    hand_element[0].style.transform       = 'rotateZ('+ hand.orientation() +'deg)';
  }

  function orient_hands() {
    orient_hand($scope.clock.hands.beat);
    orient_hand($scope.clock.hands.twenny);
  }

  function init() {
    // orient_hands whenever there is a beat announced
    $scope.$on('beat', function (event, data) {
      console.log("beat " + data);
      return orient_hands();
    });

    // Lay down the beats
    setTimeout(function() {
      $scope.beat.init();
    }, 100 );
  }
  init();


});


