const alertModal = $("#myModal");
const alertClostBtn = $('.alertModalClose');
const alertModalButtonContainer = $('#myModal .alertModal_content > div:last-child');
function showAlertModal(imgNum,text){
    $(".alertModal h3").text(text);
    let imgSrc = "";
    if(imgNum === 99){
		imgSrc = '<textarea id="report_text" placeholder="신고내용을 적어주세요"></textarea>'
		$('.alertModalClose').attr("id","reportSubmitBtn");
		$('#reportSubmitBtn').text("신고하기");
	}else if(imgNum === 98){
		imgSrc = '<img src="/images/alertImg/1-1.png" alt="">';
		 if (alertModalButtonContainer.find('#deleteAllTimelineBtn').length === 0) {
        	var deleteButton = $('<button>', {
            id: 'deleteAllTimelineBtn',
            class: 'deleteButton',
            text: '삭제하기'
        });
        

        alertModalButtonContainer.append(deleteButton);
    }
	}else{	
	    imgSrc = '<img src="/images/alertImg/1-'+imgNum+'.png" alt="">';
	    $('.alertModalClose').text("닫기");
	    $('.alertModalClose').removeAttr("id");
	}
	$(".alertModal_content div:first-child").html(imgSrc);
    alertModal.show();
    alertClostBtn.click(function() {
        alertModal.hide();
        $(".modal h3").text("");
        $('.alertModalClose').attr("id");
    });

    $(window).click(function(event) {
        if (event.target.id == 'myModal') {
            alertModal.hide();
            $(".modal h3").text("");
            $('.alertModalClose').attr("id"); 
        }
    });
}