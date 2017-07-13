/*jshint esnext: true */

/*global angular:true */
/*global console:true */
/*global _:true */


angular.module("clockApp", [])

.controller("clockCtrl", $scope => {
  const day_duration = 60 * 60 * 24;
  const beat_duration = day_duration / 1000;
  $scope.Math   = Math;
  $scope.labels = [];
  $scope.svgs   = [];
  $scope.pies   = [
    { start: 300, end: 600, radius: 200, color:"#fad541"},
    { start: 800, end: 900, radius: 200, color:"#AEB6BF"},
    { start: 900, end: 200, radius: 200, color:"#5D6D7E"}
  ];
  $scope.legends = [
    { start: 300, radius: 55, text:"work"},
    { start: 800, radius: 55, text:"relax"},
    { start: 900, radius: 55, text:"sleep"}
  ];

  $scope.meetings = [
    // TODO get below working
    // { start: $scope.beat.hour_to_beat(9), end: 500, radius: 65, weight: 5},
    { start: 375, end: 400, radius: 65, weight: 5, fill: "DARKORANGE"},
    { start: 540, end: 600, radius: 65, weight: 5, fill: "DARKORANGE"},
  ];



  $scope.clock = {
    hands: {
      beat: {
        abb: "bt",
        name: "beat",
        rotate: false,
        beat: 400,
        orientation() {
          return (Math.floor($scope.beat.pulse / 20) * 2) * 3.6 + 180;
        },
      },
      twenny: { // Twenty Beats / 1/50th of a day / about 30 minutes
        abb: "tw",
        name: "twenny",
        rotate: false,
        orientation() {
          return (($scope.beat.pulse % 20) * 5) * 3.6 + 180;
        },
      }
    }
  };





  $scope.beat = {
    hour_to_beat(h) {
      return (1000 / 24) * h;
    },
    second_to_beat(s) {
      return s / 86.4;
    },
    beat_to_second(b) {
      return b * 86.4;
    },
    elapsed_seconds(date) {
      return date.getSeconds() + (date.getMinutes() * 60) + (date.getHours() * 3600);
    },
    raw_value() {
      const current_time = new Date();
      return $scope.beat.second_to_beat($scope.beat.elapsed_seconds(current_time)).toFixed(2);
    },
    value() {
      return Math.floor($scope.beat.raw_value());
    },
    next_whole_beat() {
      return Math.ceil($scope.beat.raw_value());
    },
    set_beat(beat) {
      $scope.beat.pulse = beat;
      $scope.$broadcast('beat', beat);
    },
    advance_beat() {
      // console.log('advance_beat');
      $scope.beat.set_beat($scope.beat.pulse + 1);
    },
    init() {
      // set initial beat
      // console.log("attention");
      $scope.beat.set_beat($scope.beat.value());
      // calculate when next beat will be
      const time_now_in_seconds  = $scope.beat.elapsed_seconds();
      const next_beat_in_seconds = $scope.beat.beat_to_second($scope.beat.next_whole_beat());
      const seconds_until_next_beat = next_beat_in_seconds - time_now_in_seconds;
      // set the next beat at the correct time, then schedule the updapte
      // console.log("march in " + Math.floor(seconds_until_next_beat) );
      setTimeout(() => {
        // console.log("march");
        $scope.beat.advance_beat();
        setInterval(() => {
          // var direction = $scope.beat.pulse % 2 == 0 ? "left" : "right"
          // console.log(direction);
          $scope.beat.advance_beat();
        }, beat_duration * 1000);
      }, seconds_until_next_beat * 1000 );
    }
  };


  function orient_hand(hand) {
    const hand_element = document.querySelectorAll(`.${hand.name}-container`);
    hand_element[0].style.webkitTransform = `rotateZ(${hand.orientation()}deg)`;
    hand_element[0].style.transform       = `rotateZ(${hand.orientation()}deg)`;
  }

  function orient_hands() {
    orient_hand($scope.clock.hands.beat);
    orient_hand($scope.clock.hands.twenny);
  }




  // // create 24 hour markings
  // _.each(_.range(24), hour => {
  //   $scope.labels.push(
  //     { beat: 1000 / 24 * hour, text: hour, size: 30, radius: 45 }
  //   );
  //   return;
  // });


  // Add Swiss Clock markings
  _.each(_.range(1000), beat => {
     if (beat % 100 === 0) {
       $scope.svgs.push(
         { beat, name: "images/spritemap.svg#dash", size: "5", radius: 50 }
       );
       return;
     } else if (beat % 20 === 0) {
       $scope.svgs.push(
         { beat, name: "images/spritemap.svg#dot", size: "1.5", radius: 50 }
       );
       return;
     } else {
       return;
     }
  });


  // add car Emojis
  const cars = [280, 620];
  _.each(cars, beat => {
    $scope.labels.push(
      { beat, text: "🚗", size: 40, radius: 55 }
    );
  });


  // add work pomodoro times
  const pomodoros = [310, 330, 350, 370, 410, 430, 450, 470, 530, 550, 570, 590];
  _.each(pomodoros, beat => {
    $scope.svgs.push(
      {
        beat,
        name: "images/spritemap.svg#pomodoro",
        size: "2.5",
        radius: 80,
        fill: "ORANGERED"
      }
    );
  });


  // add ideal meal times
  const meals = [300, 400, 500, 600, 700];
  _.each(meals, beat => {
    $scope.svgs.push(
      {
        beat,
        name: "images/spritemap.svg#pomodoro",
        size: "3.5",
        radius: 30,
        fill: "OLIVEDRAB"
      }
    );
  });





  function init() {
    // orient_hands whenever there is a beat announced
    $scope.$on('beat', (event, data) => {
      console.log(`beat ${data}`);
      return orient_hands();
    });

    // Lay down the beats
    setTimeout(() => {
      $scope.beat.init();
    }, 100 );
  }
  init();


});
