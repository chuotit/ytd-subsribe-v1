// ==UserScript==
// @name         Ytd
// @namespace    Hotline: 0989.468.567 - 0961.179.678
// @version      1.0
// @description  Ytd
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js
// @author       ytd
// @match        https://www.youtube.com/*
// @match        https://accounts.google.com/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

$('body').attr('ng-app', 'ytdApp').attr('ng-controller', 'ytdController');

$('body').append(`
<div class="ytd-seo-panels">
    <div class="ytd-seo-panels-container">
        <div class="panel-setting">
            <div class="fomr-container" ng-if="enableYtdHome">
                <input type="text" id="ytdLink" ng-model="ytdLinkSubscribe" class="ytd-link" placeholder="Nhập link Youtube cần Sub" />
                <input type="button" value="Auto Sub" ng-click="startSubscribe()" class="ytd-submit">
            </div>
            <p ng-if="!enableYtdHome"><b>Đang xem: </b><span class="ytd-view-seconds"></span> giây</p>
            <div class="setting-item">
                <b>Cài đặt thời gian: </b>
                <label class="{{liked ? 'green-color' : 'red-color'}}" for="timeOfLike">LIKE:</label>
                <select id="timeOfLike" ng-options="item.value as item.name for item in timeClicks" ng-model="timeOfLike" ng-disabled="!enableYtdHome" ng-change="updateTimeClick()"></select>
                <label class="{{subscribed && notifiCation ? 'green-color' : 'red-color'}}" for="timeOfSubscribe">SUBSCRIBE:</label>
                <select id="timeOfSubscribe" ng-options="item.value as item.name for item in timeClicks" ng-model="timeOfSubscribe" ng-disabled="!enableYtdHome" ng-change="updateTimeClick()"></select>
                <label class="{{commented ? 'green-color' : 'red-color'}}" for="timeOfComment">COMMENT:</label>
                <select id="timeOfComment" ng-options="item.value as item.name for item in timeClicks" ng-model="timeOfComment" ng-disabled="!enableYtdHome" ng-change="updateTimeClick()"></select>
                <label class="red-color" for="timeOfClose">CLOSE:</label>
                <select id="timeOfClose" ng-options="item.value as item.name for item in timeClicks" ng-disabled="!enableYtdHome" ng-model="timeOfClose"></select>
            </div>
            <div class="setting-item" ng-if="!enableYtdHome">
                <b>Tùy chọn nội dung comment: </b>
                <select id="textComment" ng-options="item.no as item.text for item in listTextComments" ng-model="itemTextComment"></select>
            </div>
        </div>
    </div>
</div>
`);
GM_addStyle(`
body.ytd-watching-sub::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  
  iframe {
    display: none;
  }
  
  #columns {
    padding-bottom: 100px;
  }
  
  .ytd-seo-panels {
    position: fixed;
    bottom: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ccc;
    z-index: 999999;
  }
  .ytd-seo-panels .ytd-seo-panels-container {
    max-width: 666px;
    margin: 0 auto;
    padding: 10px;
    font-size: 13px;
  }
  .ytd-seo-panels .ytd-seo-panels-container .fomr-container {
    width: 100%;
    position: relative;
    margin-bottom: 5px;
  }
  .ytd-seo-panels .ytd-seo-panels-container .ytd-link {
    width: 100%;
    padding: 5px 85px 5px 10px;
    height: 30px;
    box-sizing: border-box;
  }
  .ytd-seo-panels .ytd-seo-panels-container .ytd-submit {
    position: absolute;
    top: 0;
    right: 0;
    height: 30px;
    width: 80px;
  }
  .ytd-seo-panels .panel-setting .setting-item {
    margin-top: 5px;
  }
  .ytd-seo-panels .panel-setting select {
    margin-right: 10px;
  }
  .ytd-seo-panels .red-color {
    color: #f00;
    font-weight: bold !important;
  }
  .ytd-seo-panels .green-color {
    color: #008000;
    font-weight: bold !important;
  }  
`);
(function () {
    var app = angular.module("ytdApp", []);
    app.controller("ytdController", ['$scope', '$timeout', '$interval', '$http', function ($scope, $timeout, $interval, $http) {
        $scope.timerStart;
        $scope.showPanel = true;
        $scope.itemTextComment;
        $timeout(function () {
            start();
        }, 1500);
        var body = document.getElementsByTagName("body")[0];
        body.addEventListener("yt-navigate-finish", function(event) {
            $('.ytd-view-seconds').text(0);
            $interval.cancel($scope.timerStart);
            $timeout(function () {
                start();
            }, 1500);
        });
        function start() {
            $('.ytd-view-seconds').text(0);
            $interval.cancel($scope.timerStart);

            $scope.subscribed = false;
            $scope.commented = false;
            $scope.liked = false;
            $scope.notifiCation = false;
            $scope.enableYtdHome = false;
            $scope.timeClicks = getTimeForClick();
            
            let ytdUrl = new URLSearchParams(window.location.search);

            if((window.location.href).indexOf('google.com')) {
                if($('#identifierId').is(':visible') && $('#identifierId').attr('type') == 'email') {
                    loginGoogle('baochautranhoan');
                }

                function loginGoogle(gmail) {
                    $('#identifierId').val(gmail);
                    $timeout(function() {
                        if($('#identifierId').val()) {
                            $('.RveJvd.snByac').trigger('click');
                            $timeout(function() {
                                enterPassword('baochau2911');
                            }, 3000);
                        }
                    }, 1000);
                }

                function enterPassword(password) {
                    if($('.whsOnd.zHQkBf').is(':visible') && $('.whsOnd.zHQkBf').attr('type') == 'password') {
                        $timeout(function() {
                            $('.whsOnd.zHQkBf').val(password);
                            $timeout(function() {
                                if($('.whsOnd.zHQkBf').val()) {
                                    $('.RveJvd.snByac').trigger('click');
                                    $timeout(function() {
                                        $('.ZFr60d.CeoRYc').trigger('click');
                                    }, 3000);
                                }
                            }, 1000);
                        }, 1000);
                    }
                }
                
                $timeout(function() {
                    if($('.Z4o1ee.GyDlGb.cd29Sd.iiFyne').is(':visible')) {
                        $('.Z4o1ee.GyDlGb.cd29Sd.iiFyne').trigger('click');
                        $timeout(function() {
                            $('.vR13fe.k6Zj8d.SmR8').each(function(index) {
                                if($($('.vR13fe.k6Zj8d.SmR8')[index]).attr('jsname') == 'o7vT9b') {
                                    $($('.vR13fe.k6Zj8d.SmR8')[index]).trigger('click');
                                    $timeout(function() {
                                        $('.M8HEDc.ibdqA.cd29Sd.bxPAYd.W7Aapd.SmR8.znIWoc').find('.vR13fe.k6Zj8d.SmR8').trigger('click');
                                        $timeout(function() {
                                            $('.ZFr60d.CeoRYc').trigger('click');
                                            $timeout(function() {
                                                loginGoogle('baochautranhoan');
                                            }, 1500);
                                        }, 1000);
                                    }, 1000);
                                }
                            });
                        }, 1500);
                    }
                }, 1000);
            }

            if(ytdUrl.has('timeOfLike') && ytdUrl.has('timeOfSubscribe') && ytdUrl.has('timeOfComment') && ytdUrl.has('timeOfClose')) {
                if($('.style-suggestive').is(':visible')) {
                    $('.style-suggestive').trigger('click');
                }
                
                $scope.enableYtdHome = false;
                $scope.timeOfLike = parseInt(ytdUrl.get('timeOfLike'));
                $scope.timeOfSubscribe = parseInt(ytdUrl.get('timeOfSubscribe'));
                $scope.timeOfComment = parseInt(ytdUrl.get('timeOfComment'));
                $scope.timeOfClose = parseInt(ytdUrl.get('timeOfClose'));
                $timeout(function () {
                    var starttime = new Date,
                    timer = 0,
                    $subscribeButton = $('.ytd-subscribe-button-renderer')[0],
                    attrSubscribe = $subscribeButton.hasAttribute('subscribed');
                    $scope.listTextComments = getListTextComments();
                    if(!$scope.itemTextComment) {
                        $scope.itemTextComment = Math.floor(Math.random() * $scope.listTextComments.length + 1);
                    }
        
                    // Check like status
                    if ($('ytd-toggle-button-renderer.force-icon-button').hasClass('style-default-active')) {
                        $scope.liked = true;
                    }
        
                    // Check subscribe status
                    if (typeof attrSubscribe !== undefined && attrSubscribe !== false) {
                        $scope.subscribed = true;
                    }
        
                    // Check Notifi status
                    if($scope.subscribed) {
                        var $notifiButton = $('#notification-preference-toggle-button')[0],
                        attrNotifi = $($notifiButton).find('yt-icon-button').attr('aria-pressed');
                        $scope.notifiCation = (attrNotifi === 'true');
                    }
    
                    $interval.cancel($scope.timerStart);
                    $scope.timerStart = $interval(function() {
                        timer = parseInt(((new Date - starttime) / 1000).toFixed(0));
                        $('.ytd-view-seconds').text(timer);
        
                        if(timer == $scope.timeOfLike && !$scope.liked) {
                            autoLike();
                        }
        
                        if(timer == $scope.timeOfSubscribe) {
                            if(!$scope.subscribed) {
                                autoSubscribe();
                            } else if(!$scope.notifiCation) {
                                autoNotifi();
                            }
                        }
        
                        if(timer == $scope.timeOfComment && !$scope.commented) {
                            autoComment();
                        }
    
                        if(timer == $scope.timeOfClose) {
                            window.open('','_parent','');
                            window.close();
                        }
                    }, 1000);
                    // Auto comment
                    function autoComment() {
                        $('html, body').animate({
                            scrollTop: $(document).height() + 100
                        }, 500, function () {
                            var commentVisible = $($('#placeholder-area')[0]).is(':visible');
                            if (commentVisible) {
                                if(!$scope.commented) {
                                    $($('#placeholder-area')[0]).trigger('click');
                                    $('#contenteditable-root').text($scope.listTextComments[$scope.itemTextComment - 1].text);
                                    $('#submit-button.ytd-commentbox').removeAttr('disabled').trigger('click').attr('disabled');
                                    $scope.commented = !$scope.commented;
                                    setTimeout(() => {
                                        $('html, body').animate({
                                            scrollTop: 0
                                        }, 500);
                                    }, 1000);
                                }
                            } else {
                                autoComment();
                            }
                        });
                    }
                    // Auto Like
                    function autoLike() {
                        $('ytd-toggle-button-renderer.force-icon-button').each(function (index) {
                            $('html, body').animate({
                                scrollTop: 0
                            }, 500);
                            if (index === 0) {
                                setTimeout(() => {
                                    $(this).trigger('click');
                                    $scope.liked = !$scope.liked;
                                }, 200);
                            }
                        });
                    }
                    // Auto Subscribe
                    function autoSubscribe() {
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);
                        $($subscribeButton).trigger('click');
                        $scope.subscribed = !$scope.subscribed;
                        setTimeout(() => {
                            autoNotifi();
                        }, 5000);
                    }
        
                    // Auto Notifi
                    function autoNotifi() {
                        $('html, body').animate({
                            scrollTop: 0
                        }, 500);
                        var $buttonNotifi = $('#notification-preference-toggle-button.ytd-subscribe-button-renderer').find('.yt-icon-button');
                        $($buttonNotifi).each(function (index) {
                            $($buttonNotifi[index]).trigger('click');
                        });
                        // if($buttonNotifi.length > 1) {
                        //     $($buttonNotifi[$buttonNotifi.length - 1]).trigger('click');
                        // } else {
                        //     $buttonNotifi.trigger('click');
                        // }
                        $scope.notifiCation = !$scope.notifiCation;
                    }
                }, 500);
            } else {
                $scope.enableYtdHome = true;
                $scope.timeOfLike = 120;
                $scope.timeOfSubscribe = 150;
                $scope.timeOfComment = 180;
                $scope.timeOfClose = 210;

                // $scope.startSubscribe = startSubscribe();
                $scope.startSubscribe = function() {
                    var ytdLink = document.getElementById('ytdLink') ;
                    var url = new URL(ytdLink.value);
                    var query_string = url.search;
                    var search_params = new URLSearchParams(query_string); 
                    search_params.set('timeOfLike', $scope.timeOfLike);
                    search_params.set('timeOfSubscribe', $scope.timeOfSubscribe);
                    search_params.set('timeOfComment', $scope.timeOfComment);
                    search_params.set('timeOfClose', $scope.timeOfClose);
                    url.search = search_params.toString();
                    var ytdLinkSubscribe = url.toString();
                    window.open(ytdLinkSubscribe, '_blank', 'width=688, height=800');
                    ytdLink.value = '';
                }
            };

            function getTimeForClick() {
                var timeClicks = [{
                    name: '5\'',
                    value: 5
                },{
                    name: '10\'',
                    value: 10
                },{
                    name: '15\'',
                    value: 15
                },{
                    name: '20\'',
                    value: 20
                },{
                    name: '30\'',
                    value: 30
                },{
                    name: '1p',
                    value: 60
                },{
                    name: '1p30\'',
                    value: 90
                },{
                    name: '2p',
                    value: 120
                },{
                    name: '2p30\'',
                    value: 150
                },{
                    name: '3p',
                    value: 180
                },{
                    name: '3p30\'',
                    value: 210
                },{
                    name: '5p',
                    value: 300
                },{
                    name: '10p',
                    value: 600
                },{
                    name: '15p',
                    value: 900
                },{
                    name: '20p',
                    value: 1200
                },];
                return timeClicks;
            };

            function getListTextComments() {
                var listTextComments = [{
                    no: 1,
                    text: 'Hay quá, mong ad upload thêm nhiều video hay hơn nữa.'
                },{
                    no: 2,
                    text: 'Nội dung video rất ý nghĩa, thanks ad.'
                },{
                    no: 3,
                    text: 'Video hay, người làm video rất có tâm.'
                },{
                    no: 4,
                    text: 'Video hay ghê.'
                },{
                    no: 5,
                    text: 'Cám ơn người úp video nhé.'
                },{
                    no: 6,
                    text: 'Tuyệt phẩm, mọi người ủng hộ nhé.'
                },{
                    no: 7,
                    text: 'Nội dung video rất thú vị.'
                },{
                    no: 8,
                    text: 'Hay lắm bạn.'
                },{
                    no: 9,
                    text: 'Mong ad sớm ra video mới nữa.'
                },{
                    no: 10,
                    text: 'Video tuyệt lắm bạn.'
                }];
                return listTextComments;
            };
            function getRandomTextcomment() {
                var listTextComment = getListTextComments(),
                    textComment = '';
                return textComment;
            }
        }
    }]);
})();


// Un Subscribe
// setTimeout(() => {
//     $($subscribeButton).trigger('click');
//     setTimeout(() => {
//         $('#confirm-button.yt-confirm-dialog-renderer').trigger('click');
//     }, 1500);
// }, 1500);


// mark screen
// $("#someDiv").bind("DOMSubtreeModified", function() {
//     alert("tree changed");
// });

// var popup;
// $('.open').click(function (e) {
//     e.preventDefault();
//     popup = window.open("", "window1", "width=400, height=400");
// });

// $('.close').click(function () {
//     if (popup) popup.close();
// });