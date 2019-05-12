// ==UserScript==
// @name         Ytd
// @namespace    Hotline: 0989.468.567 - 0961.179.678
// @version      1.0
// @description  Ytd
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js
// @author       ytd
// @match        https://www.youtube.com/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

$('body').attr('ng-app', 'ytdApp').attr('ng-controller', 'ytdController');

$('body').append(`
<div class="ytd-seo-panels">
    <div class="ytd-seo-panels-container">
        <p><b>Đang xem: </b><span class="ytd-view-seconds"></span> giây</p>
        <p>
            <b>Đã subsribe: </b> <span>{{subsribed}}</span></br>
            <b>Đã comment: </b> <span>{{commented}}</span></br>
            <b>Đã like: </b> <span>{{liked}}</span></br>
            <b>Đã notifiCation: </b> <span>{{notifiCation}}</span></br>
        </p>
    </div>
</div>
`);
GM_addStyle(`
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
#columns {
    padding-bottom: 100px;
}
.ytd-seo-panels {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border: 1px solid #ccc;
    width: 100%;
    z-index: 999999;
}
.ytd-seo-panels-container {
    max-width: 500px;
    margin: 0 auto;
    height: 100px;
    padding: 10px;
    font-size: 13px;
}
`);
(function () {
    var app = angular.module("ytdApp", []);
    app.controller("ytdController", ['$scope', '$timeout', '$interval', '$http', function ($scope, $timeout, $interval, $http) {
        $scope.timerStart;
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
            // Check watch page
            if((window.location.href).indexOf('watch') < 0) {
                return;
            }
            $scope.subsribed = false;
            $scope.commented = false;
            $scope.liked = false;
            $scope.notifiCation = false;
            $scope.enableYtdSeo = false;
            
            $timeout(function () {
                $scope.enableYtdSeo = true;
                var starttime = new Date,
                timer = 0,
                $subscribeButton = $('.ytd-subscribe-button-renderer')[0],
                attrSubscribe = $subscribeButton.hasAttribute('subscribed');
    
                // Check like status
                if ($('ytd-toggle-button-renderer.force-icon-button').hasClass('style-default-active')) {
                    $scope.liked = true;
                }
    
                // Check subsribe status
                if (typeof attrSubscribe !== undefined && attrSubscribe !== false) {
                    $scope.subsribed = true;
                }
    
                // Check Notifi status
                if($scope.subsribed) {
                    var $notifiButton = $('#notification-preference-toggle-button')[0],
                    attrNotifi = $($notifiButton).find('yt-icon-button').attr('aria-pressed');
                    $scope.notifiCation = (attrNotifi === 'true');
                }

                $interval.cancel($scope.timerStart);
                $scope.timerStart = $interval(function() {
                    timer = parseInt(((new Date - starttime) / 1000).toFixed(0));
                    $('.ytd-view-seconds').text(timer);
    
                    if(timer === 2 && !$scope.liked) {
                        autoLike();
                    }
    
                    if(timer === 5) {
                        if(!$scope.subsribed) {
                            autoSubsribe();
                        } else if(!$scope.notifiCation) {
                            autoNotifi();
                        }
                    }
    
                    if(timer === 13 && !$scope.commented) {
                        autoComment();
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
                                $('#contenteditable-root').text('Hay quá!!!');
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
                // Auto Subsribe
                function autoSubsribe() {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500);
                    $($subscribeButton).trigger('click');
                    $scope.subsribed = !$scope.subsribed;
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
        }
    }]);
})();


// Un Subsribe
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