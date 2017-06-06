$(document).ready(function () {

	$(document).foundation();

	// $('.first-carousel').slick({
	// 	autoplay: true,
	// 	autoplaySpeed: 2000
	// });

	$('.sliders').slick({
		autoplay: false,
		arrows: true,
		dots: true,
		autoplaySpeed: 8000
	});

	$('.revs').slick({
		autoplay: true,
		arrows: false,
		autoplaySpeed: 8000
	});

	$('.batch .enroll').on('click', function() {
		var name = $(this).parents('.batch').attr('id');
		if( dataVar[ name + '_active']) {
			if( dataVar[ name + '_paymentURL' ] ) {
				window.location = dataVar[ name + '_paymentURL' ];
			}	else {
				registerUserModal({
					batchName : name,
					courseName : $('#courseName').text()
				});
			}
		}	else	{
			registerUserModal({
				batchName : name,
				courseName : $('#courseName').text()
			});
		}
	});
	
	$('.course-know a').on('click', function (e) {
		if($(this).attr('href') == '#') {
			e.preventDefault();
			registerUserModal({
				batchName : 'def',
				courseName : $(this).parents('.course-info').find('.course-title').text().trim()
			});
		}
	})

	function matchHeights(elements){
		if(Array.isArray(elements) && elements.length === 0) {
			return;
		}
		var max = 0;
		for(var i=0,j=elements.length,height=0; i<j; i++) {
			height = parseFloat(elements.eq(i).css('height'));
			if(height > max) {
				max = height;
			}
		}
		elements.css('height',max+'px');
	}

	function getDateString(t) {
		if(t instanceof Date) {
			return [t.getFullYear(), ("0" + (t.getMonth() + 1)).slice(-2), ("0" + t.getDate()).slice(-2)].join('-');
		}	else {
			return null;
		}
	}

	setTimeout(function () {
		showPromotionPopup();
	}, 7000);


	matchHeights($('.trainer'));
	matchHeights($('.course-info .course-description'));
	matchHeights($('.icons .column-block > .row'));

    function initCalendar () {
        if(typeof dataVar === 'undefined') {
            setTimeout(initCalendar, 3000);
            return;
		}

        $('.timings').each(function (cal) {
            var name = $(this).parents('.batch').attr('id');
            var data = dataVar[name + '_dates'];
            if(!data) {
                console.log('no data');
                return;
            }

            $(this).dateRangePicker(
                {
                    startDate : data.startDate,
                    endDate: data.endDate,
                    stickyMonths: true,
                    beforeShowDay: function(t)
                    {
                        var date = getDateString(t);
                        var _class = '';
                        var _tooltip = '';
                        if(date === data.startDate || date === data.endDate) {
                            _class = 'endpoints'
                        }

                        if(data.specialDates[date]) {
                        	if(!_class) {
                        		_class = "special-date"
							}
                            _tooltip = data.specialDates[date];
                        }

                        return [true,_class,_tooltip];
                    }
                }
            )

        })
    }

    initCalendar();

});



// Initialize Firebase
var config = {
	apiKey: "AIzaSyCzZadP-90PJzNIfjUfesek8V-Q1OBucPs",
	authDomain: "saarthi-career.firebaseapp.com",
	databaseURL: "https://saarthi-career.firebaseio.com",
	projectId: "saarthi-career",
	storageBucket: "saarthi-career.appspot.com",
	messagingSenderId: "525172349655"
};
firebase.initializeApp(config);

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$('.step-1 .form-button').on('click', function (e) {

	var email = $(this).parents('.offer').find('.freeEmail').val().trim();
	if(email != null && email.length > 0 && validateEmail(email)) {
		$('.step').hide();
    	$('.step-2').show();
    	data = {
        	"email" : email
    	};
		
		var signUp = firebase.database().ref('signUp').push();
    	signUp.set(data);
	}	else {
		$(this).parents('.offer').find('.check-email').show();
	}
});

var registerUserModal = (function(){

	var newPostRef = firebase.database().ref('interestedPeople').push();


	var popup = new Foundation.Reveal($('#signUpModal'));
	var batchSelected = '';
	var data = {};

	$('#signUpModal .submit').on('click', function () {
		data = {
			"name" : $('#signUpModal #name').val(),
			"email" : $('#signUpModal #email').val(),
			"phone" : $('#signUpModal #phone').val(),
			"college" : $('#signUpModal #college').val(),
			"stream" : $('#signUpModal #stream').val(),
			"batch" : batchSelected
		};
		newPostRef.set(data);
		$('.form-show').css('visibility','hidden');
		$('.form-success').show();
	});
	
	var init = function (names) {
		popup.open();
		batchSelected = names.batchName;
		$('#signUpModal input').val('');
		$('#signUpModal .message>span').text(names.courseName);
		$('#signUpModal').removeClass('submitted');
	};

	return init;
})();

var showPromotionPopup = (function () {

	var open = false;

	if($('#freePdf').length === 0 || !!localStorage.viewModal) {
		var a = function () {};
        return a;
    }

	function openModal() {
		if (!open) {
			open = true;
			localStorage.setItem('viewModal', true);
			var formPopup = new Foundation.Reveal($('#freePdf'));
			formPopup.open();
		}
	}

	return openModal;
})();