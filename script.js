var app = angular.module("clock", []);
app.controller("clockCtrl", function($scope, $rootScope) {
  var day_duration = 60 * 60 * 24
  var beat_duration = day_duration / 1000

  $scope.clock = {
    face: {
      deciday: {
        markings: [0, 36, 72, 108, 144],
      },
      twenny: {
        markings: [
            0,   7.2,  14.4,  21.6,  28.8,
           36,  43.2,  50.4,  57.6,  64.8,
           72,  79.2,  86.4,  93.6, 100.8,
          108, 115.2, 122.4, 129.6, 136.8,
          144, 151.2, 158.4, 165.6, 172.8
        ],
      },
    },
    hands: {
      beat: {
        abb: "bt",
        name: "beat",
        rotate: false,
        orientation: function() {
          return (Math.floor($scope.beat.pulse / 20) * 2) * 3.6 + 180
        },
      },
      twenny: { // Twenty Beats / 1/50th of a day / about 30 minutes
        abb: "tw",
        name: "twenny",
        rotate: false,
        orientation: function() {
          return (($scope.beat.pulse % 20) * 5) * 3.6 + 180
        },
      }
    }
  }


  $scope.beat = {
    second_to_beat: function(s) {
      return s / 86.4;
    },
    beat_to_second: function(b) {
      return b * 86.4;
    },
    elapsed_seconds: function() {
      var date = new Date;
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
      console.log('advance_beat')
      $scope.beat.set_beat($scope.beat.pulse + 1);
    },
    init: function() {
      // set initial beat
      // console.log("attention");
      $scope.beat.set_beat($scope.beat.value())
      // calculate when next beat will be
      var time_now_in_seconds  = $scope.beat.elapsed_seconds()
      var next_beat_in_seconds = $scope.beat.beat_to_second($scope.beat.next_whole_beat())
      var seconds_until_next_beat = next_beat_in_seconds - time_now_in_seconds
      // set the next beat at the correct time, then schedule the updapte
      // console.log("march in " + Math.floor(seconds_until_next_beat) );
      setTimeout(function() {
        // console.log("march");
        $scope.beat.advance_beat()
        setInterval(function() {
          // var direction = $scope.beat.pulse % 2 == 0 ? "left" : "right"
          // console.log(direction);
          $scope.beat.advance_beat()
        }, beat_duration * 1000);
      }, seconds_until_next_beat * 1000 );
    }
  }

  function orient_hand(hand) {
    var hand_element = document.querySelectorAll('.' + hand.name + '-container');
    hand_element[0].style.webkitTransform = 'rotateZ('+ hand.orientation() +'deg)';
    hand_element[0].style.transform       = 'rotateZ('+ hand.orientation() +'deg)';
  }

  function orient_hands() {
    orient_hand($scope.clock.hands.beat)
    orient_hand($scope.clock.hands.twenny)
  }

  function init() {
    // orient_hands whenever there is a beat announced
    $scope.$on('beat', function (event, data) {
      console.log("beat " + data);
      return orient_hands();
    });

    // Lay down the beats
    setTimeout(function() {
      $scope.beat.init()
    }, 100 );
  };
  init()


});
